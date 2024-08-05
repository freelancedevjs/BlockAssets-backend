import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import {
  GetSubscriptionType,
  Subscription,
} from './entities/subscription.entity';
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from './inputs/subscription.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { PropertyIdInput } from '../property/inputs/property.input';
@Resolver()
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Query(() => GetSubscriptionType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManySubscriptionList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Subscription>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.subscriptionService.getMany(qs, gqlQuery);
  }

  @Query(() => Subscription)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneSubscription(
    @Args({ name: 'input' })
    qs: GetOneInput<Subscription>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.subscriptionService.getOne(qs, gqlQuery);
  }
  @Query(() => Subscription)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getMyOneSubscription(
    @Args({ name: 'input' })
    qs: GetOneInput<Subscription>,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.getOne(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
          user: { id: user.id },
        },
      },
      gqlQuery,
    );
  }

  @Query(() => GetSubscriptionType)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getMySubscriptionList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Subscription>,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.getMany(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
          user: { id: user.id },
        },
      },
      gqlQuery,
    );
  }

  @Query(() => GetSubscriptionType)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getRankedSubscriptionList(
    @Args({ name: 'input', nullable: false })
    qs: GetManyInput<Subscription>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.subscriptionService.getMany(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
        },
        order: {
          amount: 'DESC',
        },
      },
      // TODO: Fix me
      gqlQuery,
    );
  }
  @Query(() => Boolean)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getDepositStatus(
    @Args({ name: 'input', nullable: false })
    qs: PropertyIdInput,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.getDepositStatus(qs, user);
  }
  @Query(() => Number)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getMyRank(
    @Args({ name: 'input', nullable: false })
    qs: PropertyIdInput,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.getMyRank(qs, user);
  }

  @Mutation(() => Subscription)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  createSubscription(
    @Args('input') input: CreateSubscriptionInput,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.create(input, user);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  updateSubscription(
    @Args('id') id: number,
    @Args('input') input: UpdateSubscriptionInput,
    @CurrentUser() user: User,
  ) {
    return this.subscriptionService.update(id, input, user);
  }

  // @Mutation(() => GraphQLJSON)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  // deleteSubscription(@Args('id') id: number) {
  //   return this.subscriptionService.delete(id);
  // }
}
