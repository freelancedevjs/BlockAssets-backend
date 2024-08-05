import { JwtWithUser, LogoutOutput, OtpOutput } from './entities/auth._entity';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  MyOtpSendInput,
  OtpReSendInput,
  OtpSendInput,
  SignInInput,
  SignUpInput,
} from 'src/auth/inputs/auth.input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SignInGuard } from 'src/common/guards/graphql-signin.guard';
import { OtpService } from './otp.service';
import { OtpResult } from '@martianatwork/otp/dist/types';
import { UserService } from '../user/user.service';
import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => JwtWithUser)
  @UseGuards(SignInGuard)
  signIn(
    @Context() context: any,
    @Args('input') _: SignInInput,
    @CurrentUser() user: User,
  ) {
    const signin = this.authService.signIn(user);
    context.res.cookie('auth', signin.jwt);
    return { user: signin.user, jwt: signin.jwt };
  }

  @Mutation(() => LogoutOutput)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  signOut(@Context() context: any, @CurrentUser() user: User) {
    context.res.cookie('auth', '');
    const out = new LogoutOutput();
    out.success = true;
    return out;
  }
  @Mutation(() => LogoutOutput)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  deleteAccount(@Context() context: any, @CurrentUser() user: User) {
    const out = new LogoutOutput();
    out.success = true;
    return out;
  }

  @Mutation(() => JwtWithUser, {
    description: '',
  })
  async signUp(
    @Context() context: GraphQLExecutionContext,
    @Args('input') input: SignUpInput,
  ): Promise<JwtWithUser> {
    const signin = await this.authService.signUp(context, input);
    return { user: signin.user, jwt: signin.jwt };
  }

  @Mutation(() => OtpOutput, {
    description: '',
  })
  async sendOtp(
    @Context() context: any,
    @Args('input') input: OtpSendInput,
  ): Promise<OtpOutput> {
    let result: OtpResult | undefined;
    if (input.email) {
      const existing = await this.userService.getOne({
        where: { email: input.email },
      });
      if (existing) {
        throw Error('Email is already utilised');
      }
      result = await this.otpService.sendOtpToEmail(input.email);
      context.res.cookie('email_token', result.token);
    }

    if (input.phone) {
      const existing = await this.userService.getOne({
        where: { phone: input.phone },
      });
      if (existing) {
        throw Error('Phone is already utilised');
      }
      result = await this.otpService.sendOtpToPhone(input.phone);
      context.res.cookie('phone_token', result.token);
    }

    if (result.error) {
      throw new BadRequestException('Validation failed', result.error);
    }

    return {
      token: result.token,
      data: result.data,
    };
  }

  @Mutation(() => OtpOutput, {
    description: '',
  })
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  async sendMyOtp(
    @Context() context: any,
    @Args('input') input: MyOtpSendInput,
    @CurrentUser() user: User,
  ): Promise<OtpOutput> {
    let result: OtpResult | undefined;
    if (input.email) {
      result = await this.otpService.sendOtpToEmail(user.email);
      context.res.cookie('email_token', result.token);
    }

    if (input.phone) {
      result = await this.otpService.sendOtpToPhone(user.phone);
      context.res.cookie('phone_token', result.token);
    }

    if (result.error) {
      throw new BadRequestException('Validation failed', result.error);
    }

    return {
      token: result.token,
      data: result.data,
    };
  }

  @Mutation(() => OtpOutput, {
    description: '',
  })
  async resendEmailOtp(
    @Context() context: any,
    @Args('input') input: OtpReSendInput,
  ): Promise<OtpOutput> {
    const result: OtpResult = await this.otpService.resendEmailOtp(input.token);

    if (result.error) {
      throw new BadRequestException('Validation failed', result.error);
    }
    context.res.cookie('email_token', result.token);
    return {
      token: result.token,
      data: result.data,
    };
  }
  @Mutation(() => OtpOutput, {
    description: '',
  })
  async resendPhoneOtp(
    @Context() context: any,
    @Args('input') input: OtpReSendInput,
  ): Promise<OtpOutput> {
    const result: OtpResult = await this.otpService.resendPhoneOtp(input.token);

    if (result.error) {
      throw new BadRequestException('Validation failed', result.error);
    }
    context.res.cookie('phone_token', result.token);
    return {
      token: result.token,
      data: result.data,
    };
  }
}
