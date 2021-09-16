import yargs from "yargs";
import { DeploymentManager } from "./index.js";
import { logger } from "./logger.js";

const manager = new DeploymentManager();

yargs(process.argv.slice(2))
  .scriptName("fdpl")
  .help("help")
  .alias("h", "help")
  .strict(true)
  .command(
    "deploy",
    "Deploy a git repository with a Dockerfile",
    (yargs) =>
      yargs
        .option("repository", {
          alias: "r",
          describe: "Git repository uri",
          demandOption: true,
          requiresArg: true,
          type: "string",
        })
        .option("branch", {
          alias: "b",
          describe: "Git repository branch",
          default: "main",
          type: "string",
        })
        .option("name", {
          alias: "n",
          describe: "Podman container name",
          requiresArg: true,
          demandOption: true,
          type: "string",
        }),
    async (args) => {
      await manager.deploy(args);
    }
  )
  .command(
    "ls",
    "list deployments",
    (yargs) => yargs,
    async () => {
      const deployments = await manager.ls();
      if (deployments.length === 0) logger.info("No deployments found");
      else logger.info(deployments.join(", "));
    }
  )
  .command(
    "up",
    "deploy a local folder",
    (yargs) =>
      yargs.option("name", {
        alias: "n",
        describe: "Podman container name",
        requiresArg: true,
        demandOption: true,
        type: "string",
      }),
    async (args) => {
      await manager.up({ ...args, dir: process.cwd() });
    }
  )
  .command(
    "down",
    "shutdown a deployment",
    (yargs) =>
      yargs.option("name", {
        alias: "n",
        describe: "Podman container name",
        requiresArg: true,
        demandOption: true,
        type: "string",
      }),
    async (args) => {
      await manager.down({ ...args });
    }
  )
  .parse();
