import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { DisclosureService } from './disclosure.service';
import { DisclosureRepository } from './disclosure.repository';
import { DisclosureResolver } from './disclosure.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([DisclosureRepository])],
  providers: [DisclosureService, DisclosureResolver],
  exports: [DisclosureService],
})
export class DisclosureModule {}
