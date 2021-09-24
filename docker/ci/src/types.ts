// TODO: move to shared tsconfig
export interface IPipeline {
  name: string;
  preset: string;
  repo: string;
}

export const pipelineSchema = {
  type: "object",
  required: ["name", "repo", "preset"],
  properties: {
    repo: {
      type: "string",
    },
    name: {
      type: "string",
    },
    preset: {
      type: "string",
    },
  },
};

export const errorListSchema = {
  type: "array",
  items: {
    oneOf: [
      {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
          },
        },
      },
      {
        type: "object",
        required: ["isHttpError", "title", "message", "statusCode"],
        properties: {
          statusCode: {
            type: "number",
          },
          isHttpError: {
            type: "boolean",
            const: true,
          },
          title: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
      },
    ],
  },
};
