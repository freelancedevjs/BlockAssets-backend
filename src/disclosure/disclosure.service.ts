import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { DisclosureRepository } from './disclosure.repository';
import { Disclosure } from './entities/disclosure.entity';
import {
  CreateDisclosureInput,
  UpdateDisclosureInput,
} from './inputs/disclosure.input';

@Injectable()
export class DisclosureService {
  constructor(private readonly disclosureRepository: DisclosureRepository) {}

  getMany(qs: RepoQuery<Disclosure> = {}, gqlQuery?: string) {
    return this.disclosureRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Disclosure>, gqlQuery?: string) {
    return this.disclosureRepository.getOne(qs, gqlQuery);
  }

  create(input: CreateDisclosureInput) {
    const disclosure = this.disclosureRepository.create(input);

    return this.disclosureRepository.save(disclosure);
  }

  update(id: string, input: UpdateDisclosureInput) {
    const disclosure = this.disclosureRepository.create(input);

    return this.disclosureRepository.update(id, disclosure);
  }

  delete(id: string) {
    return this.disclosureRepository.delete({ id });
  }
}
