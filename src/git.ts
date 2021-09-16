import fs from "fs";
import path from "path";
import simpleGit from "simple-git";
import { logger } from "./logger.js";

/**
 * @returns The cloned git folder path
 */
export const clone = async (
  repo: string,
  branch = "main",
  cwd = path.join(process.cwd(), "deployments")
) => {
  const dir = path.join(cwd, "");
  await fs.promises.mkdir(dir);
  const git = simpleGit(dir);

  try {
    await git.clone(repo);
  } catch {
    logger.warn("Failed to clone ", repo);
  }
  await git.checkout(branch);
  await git.pull("origin", branch);

  return dir;
};
