import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { UserType } from '../../user/entities/user.entity';
import {
  CorporateUserTypeConditionalNotEmpty,
  IndividualUserTypeConditionalNotEmpty,
} from '../../common/decorators/user.decorator';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

@InputType()
export class OtpVerifyInput {
  @Field(() => String)
  @IsNotEmpty()
  otp: string;

  @Field(() => String)
  @IsNotEmpty()
  token: string;
}

@InputType()
export class OtpSendInput {
  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;
}
@InputType()
export class MyOtpSendInput {
  @Field({ nullable: true })
  @IsOptional()
  email?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  phone?: boolean;
}
@InputType()
export class OtpReSendInput {
  @Field()
  token: string;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  smsOtp: OtpVerifyInput;

  @Field()
  @IsNotEmpty()
  emailOtp: OtpVerifyInput;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  phone: string;

  @Field(() => UserType)
  @IsNotEmpty()
  userType: UserType;

  @Field(() => String, { nullable: true })
  @Validate(IndividualUserTypeConditionalNotEmpty)
  firstName: string;

  @Field(() => String, { nullable: true })
  @Validate(IndividualUserTypeConditionalNotEmpty)
  lastName: string;

  @Field(() => String, { nullable: true })
  @Validate(CorporateUserTypeConditionalNotEmpty)
  companyName: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsNotEmpty()
  postalCode: string;

  @Field()
  @IsNotEmpty()
  country: string;

  @Field(() => Date, { nullable: true })
  @Validate(IndividualUserTypeConditionalNotEmpty)
  @IsOptional()
  dob: Date;

  @Field()
  @IsNotEmpty()
  tnc_status: boolean;
}
