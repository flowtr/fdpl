import fp from "fastify-plugin";
import { config } from "../services/config.js";
import { BadRequest, NotFound } from "http-json-errors";
import DockerExecutor from "../executors/docker.js";
import { errorListSchema, IPipeline, pipelineSchema } from "../types.js";
import PgBoss from "pg-boss";
import { logger } from "../logger.js";

export default fp(async (app) => {
  const processTokenHeader = (header?: string) => {
    if (config.token !== header?.split(" ")[1])
      throw new BadRequest("Invalid api key");
  };

  const boss = new PgBoss(config.dbUri);

  boss.on("error", (error) => logger.error(error));
  await boss.start();

  app.route<{
    Params: {
      jobId: string;
    };
  }>({
    method: "GET",
    url: "/pipeline/status/:jobId",
    schema: {
      params: {
        type: "object",
        required: ["jobId"],
        properties: {
          jobId: {
            type: "string",
          },
        },
      },
      response: {
        201: {
          description: "Successful response",
          type: "object",
          required: ["state"],
          properties: {
            state: {
              type: "string",
              oneOf: [
                {
                  const: "created",
                },
                {
                  const: "retry",
                },
                {
                  const: "active",
                },
                {
                  const: "completed",
                },
                {
                  const: "expired",
                },
                {
                  const: "cancelled",
                },
                {
                  const: "failed",
                },
              ],
            },
          },
        },
        400: {
          description: "Bad request, usually an invalid token was provided",
          type: "object",
          required: ["errors"],
          properties: {
            errors: errorListSchema,
          },
        },
      },
      security: [
        {
          apiKey: [],
        },
      ],
    },
    handler: async (req, res) => {
      const job = (await boss.getJobById(
        req.params.jobId
      )) as PgBoss.JobWithMetadata<{ pipeline: IPipeline }>;
      if (!job) throw new NotFound(`Job ${req.params.jobId} not found`);

      return res.status(200).send({
        state: job.state,
        data: job.data.pipeline,
      });
    },
  });

  app.route<{
    Body: IPipeline;
  }>({
    method: "POST",
    url: "/pipeline",
    schema: {
      body: pipelineSchema,
      response: {
        201: {
          description: "Successful response",
          type: "object",
          required: ["jobId"],
          properties: {
            jobId: {
              type: "string",
            },
          },
        },
        400: {
          description: "Bad request, usually an invalid token was provided",
          type: "object",
          required: ["errors"],
          properties: { errors: errorListSchema },
        },
      },
      security: [
        {
          apiKey: [],
        },
      ],
    },
    handler: async (req, res) => {
      processTokenHeader(req.headers.authorization);
      const jobId = await boss.publish("jobs", { pipeline: req.body });
      await boss.subscribe("jobs", new DockerExecutor().processJob);

      return res.status(201).send({
        jobId,
      });
    },
  });
});
