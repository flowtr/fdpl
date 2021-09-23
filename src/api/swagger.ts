const pipeline = {
  title: "Pipeline",
  description: "Continuous Integration Pipeline",
  required: ["name", "do", "repo"],
  properties: {
    do: {
      type: "object",
      required: ["preset"],
      properties: {
        preset: {
          type: "string",
          description: "The ci preset to use",
        },
      },
      example: {
        preset: "node-test",
      },
    },
    repo: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
};

export const apiSchema = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Flowtr Panel API",
    description: "Flowtr panel (fdpl) api",
  },
  paths: {
    "/ci/pipeline": {
      post: {
        description: "Runs a ci pipeline based on the request body",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: pipeline,
              example: {
                name: "test",
                repo: "https://github.com/StephenDavidson/express-jest-example",
                do: {
                  preset: "node-test",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful response",
            content: {
              schema: {
                required: ["output"],
                type: "object",
                properties: {
                  output: {
                    type: "string",
                    description: "The output from the ci runner",
                  },
                  successful: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
