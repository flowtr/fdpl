import { FastifyReply, FastifyRequest } from "fastify";

export interface MyContext {
  req: FastifyRequest;
  res: FastifyReply;
}
