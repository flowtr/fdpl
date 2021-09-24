import PgBoss from "pg-boss";
import { Service } from "typedi";
import DockerExecutor from "../executors/docker.js";
import {
  PipelineJob,
  PipelineData,
  PipelineStatus,
} from "../graphql/schemas/pipeline.js";
import { logger } from "../logger.js";
import { IPipeline } from "../util.js";
import { config } from "./config.js";

@Service()
export class PipelineService {
  protected readonly boss = new PgBoss(config.dbUri);

  async init() {
    this.boss.on("error", (error) => logger.error(error));
    await this.boss.start();
  }

  async run({ pipeline }: { pipeline: PipelineData }) {
    const jobId = await this.boss.publish("jobs", { pipeline });
    await this.boss.subscribe("jobs", new DockerExecutor().processJob);
    return new PipelineJob(jobId === null ? undefined : jobId);
  }

  async getStatus({ jobId }: { jobId: string }) {
    const job = (await this.boss.getJobById(jobId)) as PgBoss.JobWithMetadata<{
      pipeline: IPipeline;
    }>;

    const data = new PipelineData();
    Object.entries(job.data.pipeline).map((e) => {
      (data as unknown as Record<string, unknown>)[e[0]] = e[1];
    });

    return new PipelineStatus(data.name, job.state);
  }
}
