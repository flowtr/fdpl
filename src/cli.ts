import axios from "axios";
import yargs from "yargs";
// import { DeploymentManager } from "./index.js";
import { logger } from "./logger.js";
import { createApp } from "./api/index.js";

// const manager = new DeploymentManager();

yargs(process.argv.slice(2))
  .scriptName("fdpl")
  .help("help")
  .alias("h", "help")
  .strict(true)
  .command(
    "start",
    "Start the api backend server",
    (yargs) => yargs,
    async () => {
      (await createApp()).app.listen(parseInt(process.env.PORT ?? "8080"));
      logger.info("listening on", process.env.PORT ?? "8080");
    }
  )
  .parse();
