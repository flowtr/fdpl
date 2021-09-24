import fp from "fastify-plugin";
import { ApolloServer } from "apollo-server-fastify";
import { getSchema } from "../graphql/get-schema.js";
import { MyContext } from "../graphql/context.js";

export default fp(async (app) => {
  const schema = await getSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ request, reply }) =>
      ({
        req: request,
        res: reply,
      } as MyContext),
  });

  await apolloServer.start();
  await app.register(apolloServer.createHandler({ cors: false }));
});
