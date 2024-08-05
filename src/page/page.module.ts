import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { PageService } from './page.service';
import { PageRepository } from './page.repository';
import { PageResolver } from './page.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PageRepository])],
  providers: [PageService, PageResolver],
  // exports: [PageService],
})
export class PageModule {}
