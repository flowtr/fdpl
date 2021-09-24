import { AuthChecker, buildSchema } from "type-graphql";
import { Container } from "typedi";
import { MyContext } from "./context.js";
import { PipelineResolver } from "./resolvers/pipeline.js";
import { processTokenHeader } from "./schemas/errorList.js";

export const customAuthChecker: AuthChecker<MyContext> = ({ context }) =>
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  processTokenHeader(context.req.headers.authorization); // or false if access is denied

export const getSchema = () =>
  buildSchema({
    resolvers: [PipelineResolver],

    emitSchemaFile: true,
    container: Container,
    authChecker: customAuthChecker,
  });
