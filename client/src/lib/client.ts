import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: import.meta.env.API_URI?.toString() ?? "http://127.0.0.1:8989/graphql",
  cache: new InMemoryCache(),
});
