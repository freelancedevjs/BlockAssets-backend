import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { NewsStatus } from '../entities/news.entity';

@InputType()
export class CreateNewsInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => NewsStatus)
  @IsNotEmpty()
  status: NewsStatus;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  image: FileUpload;
}

@InputType()
export class UpdateNewsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => NewsStatus, { nullable: true })
  @IsOptional()
  status?: NewsStatus;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;
}
