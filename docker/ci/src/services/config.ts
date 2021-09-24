import { z } from "zod";

const configSchema = z.object({
  port: z.number().default(() => 8989),
  token: z.string().default(() => "secret"),
  dbUri: z
    .string()
    .default(() => "postgresql://postgres:secret@localhost:5434/queue"),
  presets: z
    .array(
      z.object({
        name: z.string(),
        commands: z.array(z.string()),
      })
    )
    .default(() => [
      {
        name: "node-test",
        commands: ["pnpm install", "pnpm run test"],
      },
    ]),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse({});
