import { Field, ObjectType } from "type-graphql";
import { config } from "../../services/config.js";

@ObjectType()
export class ErrorList {
  @Field(() => [CustomError])
  errors!: CustomError[];
}

@ObjectType()
export class CustomError {
  @Field()
  message!: string;

  @Field()
  statusCode!: number;

  constructor(message: string, statusCode = 500) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const processTokenHeader = (header?: string) =>
  config.token === header?.split(" ")[1];
