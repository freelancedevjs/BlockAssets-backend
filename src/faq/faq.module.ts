import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { FaqService } from './faq.service';
import { FaqRepository } from './faq.repository';
import { FaqResolver } from './faq.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FaqRepository])],
  providers: [FaqService, FaqResolver],
  exports: [FaqService],
})
export class FaqModule {}
