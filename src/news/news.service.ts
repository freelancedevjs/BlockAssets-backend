import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { NewsRepository } from './news.repository';
import { News } from './entities/news.entity';
import { CreateNewsInput, UpdateNewsInput } from './inputs/news.input';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NewsService {
  private readonly FOLDER_NAME = 'news';

  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly uploadService: UploadService,
  ) {}

  getMany(qs: RepoQuery<News> = {}, gqlQuery?: string) {
    return this.newsRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<News>, gqlQuery?: string) {
    return this.newsRepository.getOne(qs, gqlQuery);
  }

  async create(input: CreateNewsInput) {
    const { key } = await this.uploadService.uploadFileToS3({
      folderName: this.FOLDER_NAME,
      file: input.image,
    });

    const url = this.uploadService.getLinkByKey(key);

    const news = this.newsRepository.create({
      ...input,
      image: url,
    });

    return await this.newsRepository.save(news);
  }

  async update(id: string, input: UpdateNewsInput) {
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

    const notice = this.newsRepository.create({
      ...input,
      image: final_input.image_new || oldNotice.image,
    });

    return await this.newsRepository.update(id, notice);
  }

  delete(id: string) {
    return this.newsRepository.delete({ id });
  }
}
