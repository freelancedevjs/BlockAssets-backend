import { Inject, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OtpService as OTPService, OtpStorage } from '@martianatwork/otp';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { numericalSolutionGenerator } from '@martianatwork/otp/helpers';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUserInput } from '../user/inputs/user.input';
import { ConfigService } from '@nestjs/config';
import { SettingService } from '../common/shared/services/setting.service';

export class RedisStorage implements OtpStorage {
  private map: Cache;

  constructor(cacheManager: Cache) {
    this.map = cacheManager;
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.map.set(key, value, ttl);
  }
  async get(key: string): Promise<string | null> {
    return (await this.map.get(key)) || null;
  }
  async invalidate(key: string): Promise<void> {
    await this.map.del(key);
  }
}
@Injectable()
export class OtpService {
  private otpService: OTPService;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly settingService: SettingService,
  ) {
    console.log(
      'this.settingService.isDevelopment',
      this.settingService.isDevelopment,
    );
    this.otpService = new OTPService({
      storage: new RedisStorage(this.cacheManager),
      maxAttempts: 3,
      timeToResend: 60 * 1000, // units in milliseconds
      timeToSolve: 5 * 60 * 1000, // units in milliseconds
      generateSolution: this.settingService.isDevelopment
        ? () => 123456
        : numericalSolutionGenerator(6),
      sendOtp: async (account, solution, args: any) => {
        console.log('sent otp to', account, 'with solution', solution, args);
        // write code to send otp to the user
      },
    });
  }
  async sendOtpToEmail(input: CreateUserInput['email']) {
    await this.cacheManager.set('HELLO', 'VAL', 0);
    return await this.otpService.issue(input, { platform: 'email' });
  }

  async sendOtpToPhone(input: CreateUserInput['phone']) {
    return await this.otpService.issue(input, { platform: 'phone' });
  }

  async verifyOtp(input: { token: string; otp: string }) {
    return await this.otpService.check(input.token, Number(input.otp));
  }

  async resendEmailOtp(input: string) {
    return await this.otpService.resend(input, { platform: 'email' });
  }

  async resendPhoneOtp(input: string) {
    return await this.otpService.resend(input, { platform: 'phone' });
  }
}
