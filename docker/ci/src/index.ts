import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "fastify-swagger";
import fastifyCors from "fastify-cors";
import { logger } from "./logger.js";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import middiePlugin from "middie";
import { HttpError } from "http-json-errors";
import { config } from "./services/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify();
await app.register(fastifyCors);
await app.register(fastifySwagger, {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      apiKey: {
        type: "apiKey",
        name: "apiKey",
        in: "header",
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
await app.register(middiePlugin);

app.setErrorHandler(async (err, _req, res) => {
  logger.prettyError(err);
  if (err instanceof HttpError) {
    return res.status(err.statusCode).send({
      errors: [err],
    });
  } else {
    return res.status(500).send({
      errors: [err],
    });
  }
});

app.use(async (req: FastifyRequest, _res: FastifyReply, next: () => void) => {
  logger.debug(`${req.url} :: ${req.method} :: ${req.socket.remoteAddress}`);
  next();
});

// logger.debug(config.dbUri);

await app.register(autoLoad, {
  dir: join(__dirname, "controllers"),
});

await app.listen(config.port, "0.0.0.0");
logger.info("App started on port", process.env.PORT ?? config.port);
