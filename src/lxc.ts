/* import { AxiosInstance } from "axios";

export interface RawContainer {
  architecture: "x86_64";
  config: {
    "image.architecture": "amd64";
    "image.type": "squashfs";
    "image.variant": string;
    "image.description": string;
    "image.os": string;
    "image.release": string;
    "image.serial": string;
  };
  devices: Record<string, unknown>;
  ephemeral: boolean;
  profiles: string[];
  stateful: boolean;
  description: string;
  created_at: string;
  expanded_devices: Record<string, NetworkDevice | StorageDevice>;
  expanded_config: {
    "security.nested"?: true;
  };
  name: string;
  type: "container" | "vm";
  status: "Running";
}

export interface Container {
  architecture: "x86_64";
  config: {
    imageArch: "amd64";
    imageType: "squashfs";
    imageVariant: string;
    imageDescription: string;
    imageOs: string;
    imageRelease: string;
    imageSerial: string;
    security: {
      nesting: boolean;
    };
  };
  devices: Record<string, unknown>;
  ephemeral: boolean;
  profiles: string[];
  stateful: boolean;
  description: string;
  createdAt: Date;
  expandedDevices: Record<string, NetworkDevice | StorageDevice>;
  name: string;
  type: "container" | "vm";
  status: "Running";
}

export interface NetworkDevice {
  name: string;
  network: string;
  type: "nic";
}

export interface StorageDevice {
  path: string;
  pool: string;
  type: "disk" | "btrfs";
}

export const list = async (client: AxiosInstance): Promise<Container[]> => {
  const result = await client.get<{ metadata: string[] }>("/1.0/instances");
  const containers: RawContainer[] = [];

  for await (const url of result.data.metadata) {
    const getResult = await client.get<{ metadata: RawContainer }>(url);
    containers.push(getResult.data.metadata);
  }
  return containers.map(
    (c) =>
      ({
        devices: c.devices,
        createdAt: new Date(c.created_at),
        architecture: c.architecture,
        ephemeral: c.ephemeral,
        description: c.description,
        expandedDevices: c.expanded_devices,
        name: c.name,
        stateful: c.stateful,
        status: c.status,
        config: {
          imageArch: c.config["image.architecture"],
          imageDescription: c.config["image.description"],
          imageOs: c.config["image.os"],
          imageRelease: c.config["image.release"],
          imageSerial: c.config["image.serial"],
          imageType: c.config["image.type"],
          imageVariant: c.config["image.variant"],
          security: {
            nesting: c.expanded_config["security.nested"] ?? false,
          },
        },
        profiles: c.profiles,
        type: c.type,
      } as Container)
  );
};

export interface ContainerCreateOptions {
  architecture?: string;
  config?: {
    security?: {
      nesting?: boolean;
    };
  };
  description?: string;
  devices?: Record<string, NetworkDevice | StorageDevice>;
  ephemeral?: boolean;
  name: string;
  profiles?: string[];
  source: {
    alias: "string";
    mode: "pull";
  }
}

export const create = async (
  client: AxiosInstance,
  c: ContainerCreateOptions
) =>
  await client.post("/1.0/instances", {
    architecture: c.architecture ?? "x86_64",
    config: {
      "security.nesting": c.config?.security?.nesting ?? false,
    },
    description: c.description ?? "",
    created_at: new Date().toISOString(),
    devices: c.devices ?? {},
    ephemeral: c.ephemeral ?? false,
    name: c.name,
    profiles: c.profiles ?? ["default"],
    source: c.source ?? {
      alias: 
    }
  });
 */