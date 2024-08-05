import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';
import { NewsResolver } from './news.resolver';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({}),
    TypeOrmExModule.forCustomRepository([NewsRepository]),
  ],
  providers: [NewsService, NewsResolver, UploadService],
  exports: [NewsService],
})
export class NewsModule {}
