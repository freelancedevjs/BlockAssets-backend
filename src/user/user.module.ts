import { TypeOrmExModule } from '../common/modules/typeorm.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { OtpService } from '../auth/otp.service';
import { WalletRepository } from './wallet.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { SettingService } from '../common/shared/services/setting.service';
import { SharedModule } from '../common/shared/shared.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, WalletRepository]),
    CacheModule.register(),
    SharedModule,
  ],
  providers: [UserResolver, UserService, OtpService],
  exports: [UserService],
})
export class UserModule {}
