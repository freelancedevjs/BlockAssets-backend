import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionResolver } from './subscription.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([SubscriptionRepository])],
  providers: [SubscriptionService, SubscriptionResolver],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
