import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';
import { NoticeResolver } from './notice.resolver';
import { UploadService } from '../upload/upload.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({}),
    TypeOrmExModule.forCustomRepository([NoticeRepository]),
  ],
  providers: [NoticeService, NoticeResolver, UploadService],
  exports: [NoticeService],
})
export class NoticeModule {}
