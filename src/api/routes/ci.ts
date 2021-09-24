import fp from "fastify-plugin";
import { CIService, IPipeline } from "../../services/ci.js";

export default fp(async (app) => {
  app.route<{
    Body: {
      pipeline: IPipeline;
    };
  }>({
    method: "GET",
    url: "/pipeline",
    schema: {
      response: {
        200: {
          type: "object",
          required: ["output", "finishedIn"],
          properties: {
            finishedIn: {
              type: "string",
              format: "date-time",
            },
            output: {
              type: "string",
            },
          },
        },
      },
    },
    handler: async (req, res) => {
      // TODO: background task, api request to fetch status
      const start = Date.now();

      const output = await new CIService().runPipeline(req.body.pipeline);
      const stop = Date.now();

      const timeTaken = stop - start / 1000;

      return res.status(200).send({
        output: output,
        finishedIn: timeTaken,
      });
    },
  });
});
