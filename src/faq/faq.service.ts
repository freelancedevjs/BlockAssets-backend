import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { FaqRepository } from './faq.repository';
import { Faq } from './entities/faq.entity';
import { CreateFaqInput, UpdateFaqInput } from './inputs/faq.input';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  getMany(qs: RepoQuery<Faq> = {}, gqlQuery?: string) {
    return this.faqRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Faq>, gqlQuery?: string) {
    return this.faqRepository.getOne(qs, gqlQuery);
  }

  create(input: CreateFaqInput) {
    const faq = this.faqRepository.create(input);

    return this.faqRepository.save(faq);
  }

  update(id: number, input: UpdateFaqInput) {
    const faq = this.faqRepository.create(input);

    return this.faqRepository.update(id, faq);
  }

  delete(id: number) {
    return this.faqRepository.delete({ id });
  }
}
