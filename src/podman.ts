import path from "path";
import { $, nothrow } from "zx";

export async function findPodmanBinary() {
  const r = await nothrow($`which podman`);
  if (r.exitCode) throw new Error(r.stdout);
  return r.stdout;
}

interface IPullOptions {
  image: string;
}

export async function pull(options: IPullOptions) {
  await $`podman pull ${options.image}`;
}

interface IVolume {
  host: string;
  container: string;
  options?: string;
}

interface IRunOptions {
  image: string;
  name?: string;
  timeout?: number;
  memory?: string;
  cpus?: number;
  pids?: number;
  volumes?: IVolume[];
  cwd?: string;
  command?: string;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  detach?: boolean;
}

interface IRunResult {
  status: "ok" | "timeout" | "oom";
  exitCode: number;
  id?: string;
}

export async function run(options: IRunOptions): Promise<IRunResult> {
  const args = ["--rm", "-i"];
  if (options.name !== undefined) args.push(`--name=${options.name}`);
  if (options.timeout !== undefined) args.push(`--timeout=${options.timeout}`);
  if (options.memory !== undefined)
    args.push(`--memory=${options.memory}`, `--memory-swap=${options.memory}`);
  if (options.cpus !== undefined) args.push(`--cpus=${options.cpus}`);
  // Additional PID for the time process
  if (options.pids !== undefined) args.push(`--pids-limit=${options.pids + 1}`);
  if (options.volumes !== undefined) {
    for (const volume of options.volumes) {
      const host = path.resolve(volume.host);
      let arg = `-v=${host}:${volume.container}`;
      if (volume.options !== undefined) arg += `:${volume.options}`;
      args.push(arg);
    }
  }
  if (options.cwd !== undefined) args.push(`-w=${options.cwd}`);
  if (options.detach === true) args.push(`-d`);
  args.push(options.image);
  if (options.command !== undefined) args.push(options.command);
  const result = await nothrow(
    $([`podman run ${args.join(" ")}`] as unknown as TemplateStringsArray)
  );
  if (result.exitCode === 0) {
    const id = result.stdout.trim();

    return {
      status: "ok",
      exitCode: result.exitCode,
      id,
    };
  } else {
    return {
      status: result.exitCode === 137 ? "oom" : "timeout",
      exitCode: result.exitCode,
    };
  }
}
