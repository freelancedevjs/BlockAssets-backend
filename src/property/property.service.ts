import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import {
  PropertyAttachmentRepository,
  PropertyImageRepository,
  PropertyNotificationRepository,
  PropertyRepository,
} from './property.repository';
import { Property } from './entities/property.entity';
import {
  CreatePropertyInput,
  UpdatePropertyInput,
} from './inputs/property.input';
import {
  CreatePropertyAttachmentInput,
  UpdatePropertyAttachmentInput,
} from './inputs/property-attachment.input';
import { CreatePropertyNotificationInput } from './inputs/property-notification.input';
import { User } from '../user/entities/user.entity';
import {
  CreatePropertyImageInput,
  UpdatePropertyImageInput,
} from './inputs/property-image.input';
import { PropertyImage } from './entities/property-image.entity';
import { UploadService } from '../upload/upload.service';
import {
  PropertyAttachment,
  PropertyAttachmentStatus,
} from './entities/property-attachment.entity';

@Injectable()
export class PropertyService {
  private readonly IMAGES_FOLDER_NAME = 'images';
  private readonly ATTACHMENTS_FOLDER_NAME = 'attachments';

  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyAttachmentRepository: PropertyAttachmentRepository,
    private readonly propertyNotificationRepository: PropertyNotificationRepository,
    private readonly propertyImageRepository: PropertyImageRepository,
    private readonly uploadService: UploadService,
  ) {}

  getMany(qs: RepoQuery<Property> = {}, gqlQuery?: string) {
    return this.propertyRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Property>, gqlQuery?: string) {
    return this.propertyRepository.getOne(qs, gqlQuery);
  }

  create(input: CreatePropertyInput) {
    const property = this.propertyRepository.create({
      ...input,
      firstDepositDate: new Date(input.endsAt.getTime() + 604800),
      secondDepositDate: new Date(input.endsAt.getTime() + 604800 * 2),
    });

    return this.propertyRepository.save(property);
  }

  update(id: string, input: UpdatePropertyInput) {
    const property = this.propertyRepository.create(input);

    return this.propertyRepository.update(id, property);
  }

  delete(id: string) {
    return this.propertyRepository.delete({ id });
  }

  getOneAttachment(qs: OneRepoQuery<PropertyAttachment>, gqlQuery?: string) {
    return this.propertyAttachmentRepository.getOne(qs, gqlQuery);
  }

  async createAttachment(input: CreatePropertyAttachmentInput) {
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: this.ATTACHMENTS_FOLDER_NAME,
      file: input.image,
    });

    const url = this.uploadService.getLinkByKey(key);

    const property = this.propertyAttachmentRepository.create({
      name: input.name,
      property: input.property,
      url,
      status: input.status,
    });

    return this.propertyAttachmentRepository.save(property);
  }

  async updateAttachment(id: string, input: UpdatePropertyAttachmentInput) {
    const final_input: {
      url?: string;
      name?: string;
      property?: { id: string };
      status?: PropertyAttachmentStatus;
    } = {};
    const oldNotice = await this.getOneAttachment({ where: { id: id } });
    if (input.image) {
      const mapped = oldNotice.url.split('s3.amazonaws.com/')[1];
      await this.uploadService.deleteS3Object(mapped);

      const { key } = await this.uploadService.uploadFileToS3({
        folderName: this.IMAGES_FOLDER_NAME,
        file: input.image,
      });

      final_input.url = this.uploadService.getLinkByKey(key);
    }

    if (input.name) {
      final_input.name = input.name;
    }
    if (input.property) {
      final_input.property = input.property;
    }
    if (input.status) {
      final_input.status = input.status;
    }

    const property = this.propertyAttachmentRepository.create({
      ...final_input,
    });

    return this.propertyAttachmentRepository.update(id, property);
  }

  async deleteAttachment(id: string) {
    const oldNotice = await this.getOneAttachment({ where: { id: id } });
    const mapped = oldNotice.url.split('s3.amazonaws.com/')[1];
    await this.uploadService.deleteS3Object(mapped);

    return this.propertyAttachmentRepository.delete({ id });
  }

  createNotification(input: CreatePropertyNotificationInput, user: User) {
    const property = this.propertyNotificationRepository.create({
      ...input,
      user,
    });

    return this.propertyNotificationRepository.save(property);
  }

  async deleteNotification(id: string, user: User) {
    const noti = await this.propertyNotificationRepository.getOne({
      where: { id },
    });
    if (noti.user.id !== user.id) throw Error('Invalid User');
    return this.propertyNotificationRepository.delete({ id });
  }

  getManyImage(qs: RepoQuery<PropertyImage> = {}, gqlQuery?: string) {
    return this.propertyImageRepository.getMany(qs, gqlQuery);
  }

  getOneImage(qs: OneRepoQuery<PropertyImage>, gqlQuery?: string) {
    return this.propertyImageRepository.getOne(qs, gqlQuery);
  }

  async createImage(input: CreatePropertyImageInput) {
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: this.IMAGES_FOLDER_NAME,
      file: input.image,
    });

    const url = this.uploadService.getLinkByKey(key);

    const property = this.propertyImageRepository.create({
      property: input.property,
      url,
    });

    return await this.propertyImageRepository.save(property);
  }

  async updateImage(id: string, input: UpdatePropertyImageInput) {
    const final_input: { image_new?: string } = {};
    const oldNotice = await this.getOneImage({ where: { id: id } });
    if (input.image) {
      const mapped = oldNotice.url.split('s3.amazonaws.com/')[1];
      await this.uploadService.deleteS3Object(mapped);

      const { key } = await this.uploadService.uploadFileToS3({
        folderName: this.IMAGES_FOLDER_NAME,
        file: input.image,
      });

      final_input.image_new = this.uploadService.getLinkByKey(key);
    }

    const property = this.propertyImageRepository.create({
      property: input.property,
      url: final_input.image_new || oldNotice.url,
    });

    return this.propertyImageRepository.update(id, property);
  }

  async deleteImage(id: string) {
    const oldNotice = await this.getOneImage({ where: { id: id } });
    const mapped = oldNotice.url.split('s3.amazonaws.com/')[1];
    await this.uploadService.deleteS3Object(mapped);

    return this.propertyImageRepository.delete({ id });
  }
}
