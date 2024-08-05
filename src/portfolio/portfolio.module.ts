import { Module } from '@nestjs/common';
import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioService } from './portfolio.service';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { WalletRepository } from 'src/user/wallet.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpService } from '../auth/otp.service';
import { SharedModule } from '../common/shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmExModule.forCustomRepository([WalletRepository]),
    SharedModule,
  ],

  providers: [PortfolioResolver, PortfolioService, ConfigService, OtpService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
