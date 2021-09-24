import Docker from "dockerode";
import { PassThrough } from "stream";

export class CIService {
  docker: Docker;
  constructor(public readonly token = "secret") {
    this.docker = new Docker({
      socketPath: "/var/run/docker.sock",
    });
  }

  async runPipeline(pipeline: IPipeline) {
    let output = "";

    return new Promise<string>((resolve, reject) => {
      const outStream = new PassThrough();
      outStream.on("data", (d) => (output += d.toString()));

      this.docker
        .createContainer({
          Image: "creepinson/ci-runner",
          Cmd: [
            "node",
            ".",
            "run",
            "--pipeline",
            `"${JSON.stringify(pipeline)}"`,
          ],
          Tty: false,
        })
        .then((container) => {
          container.start().then(() => {
            container.attach(
              {
                stream: true,
                stdout: true,
                stderr: true,
              },
              (err, stream) => {
                //...
                container.modem.demuxStream(
                  stream,
                  process.stdout,
                  process.stderr
                );
                container.modem.demuxStream(stream, outStream, outStream);
                stream?.on("end", () => {
                  outStream.end("Finished executing ci pipeline.");
                  resolve(output);
                });

                if (err) {
                  reject(err);
                }
                //...
              }
            );
          });
        });
    });
  }
}

export interface IPipeline {
  name: string;
  preset: string;
  repo: string;
}
