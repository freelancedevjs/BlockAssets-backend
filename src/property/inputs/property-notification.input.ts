import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyIdInput } from './property.input';

@InputType()
export class CreatePropertyNotificationInput {
  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;
}
