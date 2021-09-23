import { cd, nothrow, $ } from "zx";
import { clone } from "./git.js";
import { logger } from "./logger.js";

export class DeploymentManager {
  containers: {
    name: string;
    containerId: string;
  }[] = [];

  async init() {
    // TODO: deployment schema with mongodb
  }

  async up(args: { name: string; dir: string }) {
    cd(args.dir);
    logger.info("Building image", args.name);
    /*  await nothrow($`podman build --format docker --no-cache -t ${args.name} .`);
    logger.info("Deploying containers", [args.name].join(", "));
    const { id: containerId, status } = await run({
      image: args.name,
      name: args.name,
      detach: true,
    });
    if (!containerId || status !== "ok") {
      logger.error("Failed to create container", args.name);
      return undefined;
    }
    this.containers.push({ containerId, name: args.name });
    logger.info(
      "Created container with id ",
      containerId,
      " and name",
      containerId,
      args.name
    );
    return containerId;
  }

  async down(args: { name: string }) {
    const deployment = this.containers.find((d) => d.name === args.name);
    if (!deployment) return logger.error("Deployment", args.name, "not found");
    await nothrow($`podman rm ${deployment.containerId}`); */
  }

  async deploy(args: { repository: string; branch: string; name: string }) {
    const dir = await clone(args.repository, args.branch);
    return await this.up({ ...args, dir });
  }

  async ls() {
    return this.containers.slice();
  }
}
