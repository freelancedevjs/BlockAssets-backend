import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { PageRepository } from './page.repository';
import { Page } from './entities/page.entity';
import { CreatePageInput, UpdatePageInput } from './inputs/page.input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PageService {
  constructor(private readonly pageRepository: PageRepository) {}

  getMany(qs: RepoQuery<Page> = {}, gqlQuery?: string) {
    return this.pageRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Page>, gqlQuery?: string) {
    return this.pageRepository.getOne(qs, gqlQuery);
  }

  create(input: CreatePageInput, user: User) {
    const page = this.pageRepository.create({
      ...input,
      user: {
        id: user.id,
      },
    });

    return this.pageRepository.save(page);
  }

  update(id: number, input: UpdatePageInput) {
    const page = this.pageRepository.create({ ...input });

    return this.pageRepository.update(id, page);
  }

  delete(id: number) {
    return this.pageRepository.delete({ id });
  }
}
