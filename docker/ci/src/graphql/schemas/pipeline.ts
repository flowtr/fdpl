import { Field, InputType, ObjectType } from "type-graphql";
import { IPipeline } from "../../util.js";

@ObjectType()
export class PipelineJob {
  @Field(() => String, { nullable: true })
  jobId?: string;

  constructor(jobId?: string) {
    this.jobId = jobId;
  }
}

@InputType()
export class PipelineJobInput {
  @Field(() => String, { nullable: true })
  jobId?: string;

  constructor(jobId?: string) {
    this.jobId = jobId;
  }
}

@ObjectType()
export class PipelineData {
  @Field()
  name!: string;

  @Field()
  repository!: string;

  @Field()
  preset!: string;
}

@InputType()
export class PipelineInput implements IPipeline {
  @Field()
  name!: string;

  @Field()
  repository!: string;

  @Field()
  preset!: string;
}

@ObjectType()
export class PipelineResponse {
  @Field(() => PipelineJob)
  job!: PipelineJob;

  @Field(() => PipelineData)
  data!: PipelineData;

  constructor(job: PipelineJob, data: PipelineData) {
    this.job = job;
    this.data = data;
  }
}

@ObjectType()
export class PipelineStatus {
  @Field()
  state!: string;

  @Field()
  name!: string;

  constructor(name: string, state: string) {
    this.state = state;
    this.name = name;
  }
}
