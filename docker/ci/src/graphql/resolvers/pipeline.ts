import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Container, Service } from "typedi";
import { PipelineService } from "../../services/pipelineService.js";
import {
  PipelineInput,
  PipelineJobInput,
  PipelineResponse,
  PipelineStatus,
} from "../schemas/pipeline.js";

@Resolver()
@Service()
export class PipelineResolver {
  @Mutation(() => PipelineResponse)
  @Authorized()
  async runPipeline(@Arg("pipeline") pipeline: PipelineInput) {
    const job = await Container.get(PipelineService).run({ pipeline });

    const response = new PipelineResponse(job, pipeline);
    return response;
  }

  @Query(() => PipelineStatus)
  async getPipelineStatus(@Arg("job") job: PipelineJobInput) {
    const res = await Container.get(PipelineService).getStatus({
      jobId: job.jobId ?? "unknown",
    });
    return res;
  }
}
