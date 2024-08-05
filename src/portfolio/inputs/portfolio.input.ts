import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { OtpVerifyInput } from '../../auth/inputs/auth.input';

@InputType()
export class SendFundsInput {
  @Field(() => String)
  @IsNotEmpty()
  toAddress: string;

  @Field(() => String)
  @IsNotEmpty()
  tokenAddress: string | '0x0000000000000000000000000000000000000000';

  @Field(() => String)
  @IsNotEmpty()
  amount: string;

  @Field()
  @IsNotEmpty()
  emailOtp: OtpVerifyInput;
}

@InputType()
export class CursorInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  limit?: number;

  @Field(() => [String], { nullable: true })
  contract_addresses?: string[];
}
