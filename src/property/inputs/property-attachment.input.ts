import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyAttachmentStatus } from '../entities/property-attachment.entity';
import { PropertyIdInput } from './property.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreatePropertyAttachmentInput {
  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  image: FileUpload;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => PropertyAttachmentStatus)
  @IsNotEmpty()
  status: PropertyAttachmentStatus;
}

@InputType()
export class UpdatePropertyAttachmentInput {
  @Field(() => PropertyIdInput)
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => GraphQLUpload)
  @IsOptional()
  image?: FileUpload;

  @Field(() => String)
  @IsOptional()
  name?: string;

  @Field(() => PropertyAttachmentStatus)
  @IsOptional()
  status?: PropertyAttachmentStatus;
}
