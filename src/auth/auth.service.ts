import { UserService } from '../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInInput, SignUpInput } from 'src/auth/inputs/auth.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { JwtWithUser } from './entities/auth._entity';
import { OtpService } from './otp.service';
import { GraphQLExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  private signJWT(user: User) {
    return this.jwtService.sign(pick(user, ['id', 'role']));
  }

  async signUp(context: any, input: SignUpInput): Promise<JwtWithUser> {
    const doesExistId = await this.userService.getOne({
      where: { email: input.email },
    });

    if (doesExistId) {
      throw new BadRequestException('Email already exists');
    }
    const doesExistPhone = await this.userService.getOne({
      where: { phone: input.phone },
    });

    if (doesExistPhone) {
      throw new BadRequestException('Phone already exists');
    }

    const emailToken = context.req.cookies['email_token'];
    const verified = await this.otpService.verifyOtp({
      ...input.emailOtp,
      token: emailToken,
    });
    if (!verified.meta.isSolved) {
      context.res.cookie('email_token', verified.token);
      throw Error(`Email: ${verified.error}`);
    }

    const smsToken = context.req.cookies['phone_token'];
    const smsVerified = await this.otpService.verifyOtp({
      ...input.smsOtp,
      token: smsToken,
    });
    if (!smsVerified.meta.isSolved) {
      context.res.cookie('phone_token', smsVerified.token);
      throw Error(`Phone: ${smsVerified.error}`);
    }

    delete input.emailOtp;
    delete input.smsOtp;
    const user = await this.userService.create({ ...input, role: 'user' });

    return this.signIn(user);
  }

  signIn(user: User) {
    const jwt = this.signJWT(user);

    return { jwt, user };
  }

  async validateUser(input: SignInInput) {
    const { email, password } = input;

    const user = await this.userService.getOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}
