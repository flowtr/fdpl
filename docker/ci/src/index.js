import yargs from "yargs";
import simpleGit from "simple-git";
import fs from "fs";
import Docker from "dockerode";
import { Logger } from "tslog";
import { $ } from "zx";
import { cd } from "zx";

const logger = new Logger({
  displayFunctionName: false,
  displayFilePath: "hidden",
});

/**
 * @typedef Do
 * @property {string} preset
 */

/**
 * @typedef Pipeline
 * @property {string} name
 * @property {string} repo
 * @property {Do} do
 */

yargs(process.argv.slice(2))
  .scriptName("ci-runner")
  .command(
    "run",
    "run a ci pipeline",
    (y) =>
      y.option("pipeline", {
        type: "string",
        demandOption: true,
        requiresArg: true,
      }),
    async (args) => {
      await $`rm -rf /data/runner`;
      fs.mkdirSync("/data/runner", { recursive: true });
      const git = simpleGit({
        baseDir: "/data/runner",
        binary: "git",
        maxConcurrentProcesses: 6,
      });

      /**
       * @type {Pipeline}
       */
      const pipeline = JSON.parse(args.pipeline);

      logger.info(`Cloning git repository ${pipeline.repo}`);
      await git.clone(pipeline.repo, "/data/runner");
      const docker = new Docker();

      logger.info(
        `Running pipeline ${pipeline.name} with preset ${pipeline.do.preset} and repository ${pipeline.repo}`
      );

      switch (pipeline.do.preset) {
        case "node-test":
          cd("/data/runner");
          await $`pnpm install`;
          await $`pnpm run test`;
          process.exit(0);
      }
    }
  )
  .strict(true)
  .parse();
