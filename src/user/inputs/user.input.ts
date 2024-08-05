import { IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { UserType } from '../entities/user.entity';
import {
  CorporateUserTypeConditionalNotEmpty,
  IndividualUserTypeConditionalNotEmpty,
} from '../../common/decorators/user.decorator';
import { OtpVerifyInput } from '../../auth/inputs/auth.input';

@InputType()
export class CreateUserInput {
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

  @Field(() => String)
  @IsNotEmpty()
  role: 'admin' | 'user';

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

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string;

  @Field(() => OtpVerifyInput, { nullable: true })
  @IsOptional()
  emailOtp?: OtpVerifyInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  marketing?: boolean;

  @Field(() => OtpVerifyInput, { nullable: true })
  @IsOptional()
  phoneOtp?: OtpVerifyInput;

  @Field(() => String, { nullable: true })
  @IsOptional()
  password?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  new_password?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  confirm_new_password?: string;
}

@InputType()
export class UpdateUserAdminInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: 'admin' | 'user';

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  password?: string;
}

@InputType()
export class UserIdInput {
  @Field(() => String)
  @IsNotEmpty()
  id: string;
}
