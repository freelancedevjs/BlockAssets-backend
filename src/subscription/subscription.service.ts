import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/common/graphql/types';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription } from './entities/subscription.entity';
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from './inputs/subscription.input';
import { User } from '../user/entities/user.entity';
import { PropertyIdInput } from '../property/inputs/property.input';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  getMany(qs: RepoQuery<Subscription> = {}, gqlQuery?: string) {
    return this.subscriptionRepository.getMany(qs, gqlQuery);
  }

  getOne(qs: OneRepoQuery<Subscription>, gqlQuery?: string) {
    return this.subscriptionRepository.getOne(qs, gqlQuery);
  }
  async getMyRank(qs: PropertyIdInput, user: User): Promise<number> {
    const myRank = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('RANK() OVER (ORDER BY amount DESC) AS rank')
      .where('userId = :userId', { userId: user.id })
      .where('propertyId = :propertyId', { propertyId: qs.id })
      .getRawOne<{ rank: number }>();
    return myRank.rank || 0;
  }
  async getDepositStatus(qs: PropertyIdInput, user: User): Promise<boolean> {
    const myRank = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('RANK() OVER (ORDER BY amount DESC) AS rank')
      .where('userId = :userId', { userId: user.id })
      .where('propertyId = :propertyId', { propertyId: qs.id })
      .getRawOne<{ rank: number }>();

    return true;
  }

  async create(input: CreateSubscriptionInput, user: User) {
    const oldSubscription = await this.subscriptionRepository.getOne({
      where: { property: { id: input.property.id }, user: { id: user.id } },
    });

    if (oldSubscription)
      throw Error('You already have subscription for this property');

    const subscription = this.subscriptionRepository.create({
      ...input,
      user: user,
    });

    return await this.subscriptionRepository.save(subscription);
  }

  async update(id: number, input: UpdateSubscriptionInput, user: User) {
    const oldSubscription = await this.subscriptionRepository.getOne({
      where: { id },
    });
    if (oldSubscription.amount > input.amount) throw Error('Invalid Amount');

    const subscription = this.subscriptionRepository.create({
      ...input,
      user,
    });

    return await this.subscriptionRepository.update(id, subscription);
  }

  delete(id: number) {
    return this.subscriptionRepository.delete({ id });
  }
}
