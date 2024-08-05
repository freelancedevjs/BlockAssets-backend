import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyIdInput } from '../../property/inputs/property.input';
import { UserIdInput } from '../../user/inputs/user.input';

@InputType()
export class CreateSubscriptionInput {
  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;

  @Field(() => Number)
  @IsNotEmpty()
  amount: number;

  @Field(() => Number)
  @IsNotEmpty()
  warranty: number;
}

@InputType()
export class UpdateSubscriptionInput {
  @Field(() => Number)
  @IsNotEmpty()
  amount: number;

  @Field(() => Number)
  @IsNotEmpty()
  warranty: number;
}
