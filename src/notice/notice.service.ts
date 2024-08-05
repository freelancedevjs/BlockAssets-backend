import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { NoticeRepository } from './notice.repository';
import { Notice } from './entities/notice.entity';
import { CreateNoticeInput, UpdateNoticeInput } from './inputs/notice.input';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NoticeService {
  private readonly FOLDER_NAME = 'notices';

  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly uploadService: UploadService,
  ) {}

  getMany(qs: RepoQuery<Notice> = {}, gqlQuery?: string) {
    return this.noticeRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Notice>, gqlQuery?: string) {
    return this.noticeRepository.getOne(qs, gqlQuery);
  }

  async create(input: CreateNoticeInput) {
    let url = undefined;
    if (input.image) {
      const { key } = await this.uploadService.uploadFileToS3({
        folderName: this.FOLDER_NAME,
        file: input.image,
      });

      url = this.uploadService.getLinkByKey(key);
    }
    const notice = this.noticeRepository.create({
      ...input,
      image: url,
    });

    return await this.noticeRepository.save(notice);
  }

  async update(id: number, input: UpdateNoticeInput) {
    const final_input: { image_new?: string } = {};
    const oldNotice = await this.getOne({ where: { id: id } });
    if (input.image) {
      const mapped = oldNotice.image.split('s3.amazonaws.com/')[1];
      await this.uploadService.deleteS3Object(mapped);

      const { key } = await this.uploadService.uploadFileToS3({
        folderName: this.FOLDER_NAME,
        file: input.image,
      });

      final_input.image_new = this.uploadService.getLinkByKey(key);
    }

    const notice = this.noticeRepository.create({
      ...input,
      image: final_input.image_new || oldNotice.image,
    });

    return await this.noticeRepository.update(id, notice);
  }

  async delete(id: number) {
    const oldNotice = await this.getOne({ where: { id: id } });
    const mapped = oldNotice.image.split('s3.amazonaws.com/')[1];
    await this.uploadService.deleteS3Object(mapped);

    return this.noticeRepository.delete({ id });
  }
}
