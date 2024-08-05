import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { PropertyService } from './property.service';
import {
  PropertyAttachmentRepository,
  PropertyImageRepository,
  PropertyNotificationRepository,
  PropertyRepository,
} from './property.repository';
import { PropertyResolver } from './property.resolver';
import { UploadService } from '../upload/upload.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({}),
    TypeOrmExModule.forCustomRepository([
      PropertyRepository,
      PropertyImageRepository,
      PropertyAttachmentRepository,
      PropertyNotificationRepository,
    ]),
  ],
  providers: [PropertyService, PropertyResolver, UploadService],
  exports: [PropertyService],
})
export class PropertyModule {}
