import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PropertyIdInput } from '../../property/inputs/property.input';
import { VoteAction } from '../entities/vote-entry.entity';

@InputType()
export class CreateVoteInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => PropertyIdInput)
  @IsNotEmpty()
  property: PropertyIdInput;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => Date)
  @IsNotEmpty()
  startsAt: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endsAt: Date;
}

@InputType()
export class UpdateVoteInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  startsAt?: Date;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  endsAt?: Date;
}

@InputType()
export class VoteIdInput {
  @Field(() => String)
  @IsNotEmpty()
  id: string;
}

@InputType()
export class CreateVoteEntryInput {
  @Field(() => VoteIdInput)
  @IsNotEmpty()
  vote: VoteIdInput;

  @Field(() => VoteAction)
  @IsNotEmpty()
  action: VoteAction;
}
