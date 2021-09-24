// import swaggerValidation from "openapi-validator-middleware";
import { logger } from "../logger.js";
import ci from "./routes/ci.js";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { apiSchema } from "./swagger.js";
import fastifySwagger from "fastify-swagger";
import fastifyCors from "fastify-cors";
import middiePlugin from "middie";

export const createApp = async (): Promise<{
  app: ReturnType<typeof fastify>;
}> => {
  const app = fastify();

  await app.register(fastifySwagger, {
    routePrefix: "/documentation",
    swagger: {
      info: {
        title: "Test swagger",
        description: "Testing the Fastify swagger API",
        version: "0.1.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [
        { name: "user", description: "User related end-points" },
        { name: "code", description: "Code related end-points" },
      ],
      definitions: {
        User: {
          type: "object",
          required: ["id", "email"],
          properties: {
            id: { type: "string", format: "uuid" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });

  app.setErrorHandler(async (err, _req, res) => {
    if (err) {
      logger.prettyError(err);
      return res.status(400).send({
        errors: [err],
      });
    }
  });

  await app.register(middiePlugin);

  app.use(async (req: FastifyRequest, _res: FastifyReply, next: () => void) => {
    logger.debug(`${req.url} :: ${req.method} :: ${req.socket.remoteAddress}`);
    next();
  });

  // app.use(swaggerValidation.validate);

  await app.register(ci);

  return { app };
};
