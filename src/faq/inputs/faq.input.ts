import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { FaqStatus } from '../entities/faq.entity';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateFaqInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => FaqStatus, { nullable: true })
  @IsOptional()
  status: FaqStatus;
}

@InputType()
export class UpdateFaqInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content: string;

  @Field(() => FaqStatus, { nullable: true })
  @IsOptional()
  status: FaqStatus;
}
