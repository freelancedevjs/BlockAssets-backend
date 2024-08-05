import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { VoteEntryRepository, VoteRepository } from './vote.repository';
import { Vote } from './entities/vote.entity';
import {
  CreateVoteEntryInput,
  CreateVoteInput,
  UpdateVoteInput,
  VoteIdInput,
} from './inputs/vote.input';
import { VoteAction, VoteEntry } from './entities/vote-entry.entity';
import { User } from '../user/entities/user.entity';
import { isFuture, isPast } from 'date-fns';

@Injectable()
export class VoteService {
  constructor(
    private readonly voteRepository: VoteRepository,
    private readonly voteEntryRepository: VoteEntryRepository,
  ) {}

  getMany(qs: RepoQuery<Vote> = {}, gqlQuery?: string) {
    return this.voteRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Vote>, gqlQuery?: string) {
    return this.voteRepository.getOne(qs, gqlQuery);
  }

  getManyEntries(qs: RepoQuery<VoteEntry> = {}, gqlQuery?: string) {
    return this.voteEntryRepository.getMany(qs, gqlQuery);
  }

  getOneEntry(qs: OneRepoQuery<VoteEntry>, gqlQuery?: string) {
    return this.voteEntryRepository.getOne(qs, gqlQuery);
  }

  async getVoteProgress(input: VoteIdInput): Promise<{
    approved: number;
    rejected: number;
    totalVotes: number;
    totalParticipated: number;
  }> {
    const approved =
      (await this.voteEntryRepository
        .createQueryBuilder('voteEntry')
        .where('voteEntry.action = :action', { action: VoteAction.APPROVE })
        .leftJoinAndSelect('voteEntry.vote', 'vote')
        .where('vote.id = :voteId', { voteId: input.id })
        .leftJoinAndSelect('vote.property', 'property')
        .leftJoinAndSelect('property.subscription', 'subscription')
        .select('SUM(subscription.amount)', 'totalStakedAmount')
        .getRawOne()) || 0;
    const rejected =
      (await this.voteEntryRepository
        .createQueryBuilder('voteEntry')
        .where('voteEntry.action = :action', { action: VoteAction.REJECT })
        .leftJoinAndSelect('voteEntry.vote', 'vote')
        .where('vote.id = :voteId', { voteId: input.id })
        .leftJoinAndSelect('vote.property', 'property')
        .leftJoinAndSelect('property.subscription', 'subscription')
        .select('SUM(subscription.amount)', 'totalStakedAmount')
        .getRawOne()) || 0;
    const totalStaked =
      (await this.voteRepository
        .createQueryBuilder('vote')
        .where('vote.id = :voteId', { voteId: input.id })
        .leftJoinAndSelect('vote.property', 'property')
        .leftJoinAndSelect('property.subscription', 'subscription')
        .select('SUM(subscription.amount)', 'totalStakedAmount')
        .getRawOne()) || 0;
    return {
      approved,
      rejected,
      totalVotes: totalStaked,
      totalParticipated: approved + rejected,
    };
  }
  create(input: CreateVoteInput) {
    const vote = this.voteRepository.create(input);

    return this.voteRepository.save(vote);
  }

  async createEntry(input: CreateVoteEntryInput, user: User) {
    const vote = await this.getOne({
      where: {
        id: input.vote.id,
      },
    });
    if (!vote) {
      throw Error('Vote not found');
    }

    if (isFuture(vote.startsAt)) {
      throw Error('Voting not ready yet');
    }

    if (isPast(vote.endsAt)) {
      throw Error('Voting period ended');
    }
    const entry = this.voteEntryRepository.create({
      ...input,
      user: { id: user.id },
    });

    return await this.voteEntryRepository.save(entry);
  }
  async updateEntry(input: CreateVoteEntryInput, user: User) {
    const vote = await this.getOne({
      where: {
        id: input.vote.id,
      },
    });
    if (!vote) {
      throw Error('Vote not found');
    }

    if (isFuture(vote.startsAt)) {
      throw Error('Voting not ready yet');
    }

    if (isPast(vote.endsAt)) {
      throw Error('Voting period ended');
    }

    const existing = await this.getOneEntry({
      where: {
        user: { id: user.id },
        vote: { id: input.vote.id },
      },
    });

    if (!existing) {
      throw Error('Entry not found');
    }

    const entry = this.voteEntryRepository.create({
      action: input.action,
    });

    return await this.voteEntryRepository.update(existing.id, entry);
  }

  update(id: string, input: UpdateVoteInput) {
    const vote = this.voteRepository.create(input);

    return this.voteRepository.update(id, vote);
  }

  delete(id: string) {
    return this.voteRepository.delete({ id });
  }
}
