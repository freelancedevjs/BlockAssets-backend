import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { DisclosureStatus } from '../entities/disclosure.entity';
import { PropertyIdInput } from '../../property/inputs/property.input';

@InputType()
export class CreateDisclosureInput {
  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => DisclosureStatus)
  @IsNotEmpty()
  status: DisclosureStatus;
}

@InputType()
export class UpdateDisclosureInput {
  @Field(() => PropertyIdInput)
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => String)
  @IsOptional()
  name?: string;

  @Field(() => String)
  @IsOptional()
  content?: string;

  @Field(() => DisclosureStatus)
  @IsOptional()
  status?: DisclosureStatus;
}
