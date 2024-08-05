import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { User } from './entities/user.entity';
import {
  CreateUserInput,
  UpdateUserAdminInput,
  UpdateUserInput,
} from './inputs/user.input';
import { ethers } from 'ethers';
import { WalletRepository } from './wallet.repository';
import { OtpService } from '../auth/otp.service';
import * as bcrypt from 'bcrypt';
import { CreateWalletInput } from './inputs/wallet.input';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly otpService: OtpService,
  ) {}

  getMany(qs: RepoQuery<User> = {}, gqlQuery?: string) {
    return this.userRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<User>, gqlQuery?: string) {
    return this.userRepository.getOne(qs, gqlQuery);
  }

  create(input: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(input);

    return this.userRepository.save(user);
  }

  update(id: string, input: UpdateUserAdminInput) {
    const user = this.userRepository.create(input);

    return this.userRepository.update(id, user);
  }

  async updateEmail(user: User, input: UpdateUserInput) {
    const final_input: {
      email?: string;
      password?: string;
      phone?: string;
      marketing?: boolean;
    } = {
      marketing: input?.marketing || user?.marketing,
    };
    if (input.email) {
      if (!input.emailOtp) {
        throw Error('Email OTP not provided');
      }
      const existing = await this.userRepository.findOne({
        where: { email: input.email },
      });
      if (existing) {
        throw Error('Email is already utilised');
      }
      const verified = await this.otpService.verifyOtp(input.emailOtp);
      if (!verified.meta.isSolved) {
        throw Error(verified.error);
      }
      final_input.email = input.email;
    }

    if (input.phone) {
      if (!input.phoneOtp) {
        throw Error('Phone OTP not provided');
      }
      const existing = await this.userRepository.findOne({
        where: { phone: input.phone },
      });
      if (existing) {
        throw Error('Phone is already utilised');
      }
      const verified = await this.otpService.verifyOtp(input.phoneOtp);
      if (!verified.meta.isSolved) {
        throw Error(verified.error);
      }
      final_input.phone = input.phone;
    }

    if (input.password) {
      if (
        input.confirm_new_password &&
        input.confirm_new_password !== input.new_password
      ) {
        throw Error('Invalid new password');
      }

      const isValid: boolean = await bcrypt.compare(
        input.password,
        user.password,
      );

      if (!isValid) {
        throw Error('Invalid password');
      }

      final_input.password = input.new_password;
    }

    const userUpdate = this.userRepository.create(final_input);

    return this.userRepository.update(user.id, userUpdate);
  }

  async updateWallet(user: User, input: CreateWalletInput) {
    const userWallet = await user?.wallet;
    if (userWallet?.id) {
      throw new Error('Wallet Exists');
    }
    const wallet = new ethers.Wallet(input.private_key);
    if (!wallet) {
      throw new Error('Private Key is not valid');
    }
    const wa = this.walletRepository.create({
      address: wallet.address,
      private_key: input.private_key,
      user: {
        id: user.id,
      },
    });

    return this.walletRepository.save(wa);
  }

  delete(id: string) {
    return this.userRepository.delete({ id });
  }
}
