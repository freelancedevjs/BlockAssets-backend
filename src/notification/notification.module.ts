import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { NotificationResolver } from './notification.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([NotificationRepository])],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
