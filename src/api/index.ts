import express, { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
// import swaggerValidation from "openapi-validator-middleware";
import { logger } from "../logger.js";
import ci from "./routes/ci.js";
import swaggerUi from "swagger-ui-express";
import { apiSchema } from "./swagger.js";

export const createApp = async (): Promise<{ app: express.Express }> => {
  const app = express();

  app.use(((err, req, res, next) => {
    if (err) {
      logger.prettyError(err);
      return res.status(400).json({
        errors: [err],
      });
    }

    next();
    /*       if (err instanceof swaggerValidation.InputValidationError) {
      return res.status(400).json({ errors: err.errors });
    } else { */
  }) as ErrorRequestHandler);

  app.use(express.json());

  app.use((req, _res, next) => {
    logger.debug(`${req.path} :: ${req.method}`);
    next();
  });

  app.use(cookieParser(process.env.SESSION_SECRET ?? "secret69420"));

  // app.use(swaggerValidation.validate);
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(apiSchema));

  app.use("/ci", await ci());

  return { app };
};
