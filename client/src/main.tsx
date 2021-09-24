import { ChakraProvider } from "@chakra-ui/react";
import { render } from "preact";
import { App } from "./app";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/client";

const app = document.getElementById("app");
if (!app) throw new Error("No root element named app");

render(
  <ChakraProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ChakraProvider>,
  app
);
