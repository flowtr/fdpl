import { Router } from "express";
import { CIService } from "../../services/ci.js";

export default async (): Promise<ReturnType<typeof Router>> => {
  const app = Router();
  app.post("/pipeline", async (req, res) => {
    try {
      // TODO: background task, api request to fetch status
      const output = await new CIService().runPipeline(req.body);
      return res.status(200).json({
        output: output,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
  return app;
};
