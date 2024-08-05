import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyIdInput } from './property.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreatePropertyImageInput {
  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  image: FileUpload;
}

@InputType()
export class UpdatePropertyImageInput {
  @Field(() => PropertyIdInput)
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => GraphQLUpload)
  @IsOptional()
  image?: FileUpload;
}
