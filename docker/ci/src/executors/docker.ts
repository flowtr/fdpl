import PgBoss from "pg-boss";
import { logger } from "../logger.js";
import { IPipeline } from "../util.js";
import Docker from "dockerode";
import { $, fs } from "zx";
import { cd } from "zx";
import path from "path";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node/index.js";
import { config } from "../services/config.js";

export class DockerExecutor {
  protected docker: Docker;

  constructor(
    public readonly dataDir = path.join(process.cwd(), "data", "deployments")
  ) {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    this.processJob = this.processJob.bind(this);
    this.docker = new Docker({
      socketPath: process.env.DOCKER_SOCK ?? "/var/run/docker.sock",
    });
  }

  async processJob(
    job: PgBoss.JobWithDoneCallback<{ pipeline: IPipeline }, unknown>
  ) {
    const pipeline = job.data.pipeline;
    const runnerDir = path.join(this.dataDir, "runner");
    await $`rm -rf ${runnerDir}`;
    fs.mkdirSync(runnerDir, { recursive: true });

    logger.info(`Cloning git repository ${pipeline.repository}`);
    await git.clone({
      dir: runnerDir,
      url: pipeline.repository,
      fs,
      http,
    });

    logger.info(
      `Running pipeline ${pipeline.name} with preset ${pipeline.preset} and repository ${pipeline.repository}`
    );

    cd(runnerDir);

    const preset = config.presets.find(
      (preset) => preset.name === pipeline.preset
    );

    if (!preset) throw new Error(`Invalid CI preset ${pipeline.preset}`);

    for await (const command of preset.commands) {
      await $`eval ${command}`;
    }
  }
}

export default DockerExecutor;
