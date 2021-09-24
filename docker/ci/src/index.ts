import "reflect-metadata";
import fastify from "fastify";
import fastifyCors from "fastify-cors";
import { logger } from "./logger.js";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import middiePlugin from "middie";
import { HttpError } from "http-json-errors";
import { config } from "./services/config.js";
import { Container } from "typedi";
import { PipelineService } from "./services/pipelineService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify();
await app.register(fastifyCors);
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

// logger.debug(config.dbUri);

await app.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

await app.register(autoLoad, {
  dir: join(__dirname, "controllers"),
});

await Container.get(PipelineService).init();

await app.listen(config.port, "0.0.0.0");
logger.info("App started on port", process.env.PORT ?? config.port);
