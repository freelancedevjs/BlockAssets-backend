import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  jwt: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class OtpOutputData {
  @Field(() => String)
  id: string;

  @Field(() => String)
  account: string;

  @Field(() => Number)
  expiresAt: number;

  @Field(() => Number)
  resendAt: number;

  @Field(() => Number)
  attemptsRemaining: number;
}
@ObjectType()
export class OtpOutput {
  @Field(() => String)
  token: string;

  @Field(() => OtpOutputData)
  data: OtpOutputData;
}

@ObjectType()
export class LogoutOutput {
  @Field(() => Boolean)
  success: boolean;
}
