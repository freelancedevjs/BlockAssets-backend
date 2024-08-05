import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PageStatus } from '../entities/page.entity';

@InputType()
export class CreatePageInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => PageStatus, { nullable: true })
  @IsOptional()
  status?: PageStatus;
}

@InputType()
export class UpdatePageInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => PageStatus, { nullable: true })
  @IsOptional()
  status?: PageStatus;
}
