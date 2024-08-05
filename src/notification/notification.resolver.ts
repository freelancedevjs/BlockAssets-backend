import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import {
  GetNotificationType,
  Notification,
} from './entities/notification.entity';
import {
  CreateNotificationInput,
  UpdateNotificationInput,
} from './inputs/notification.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => GetNotificationType)
  @UseGuards(new GraphqlPassportAuthGuard(['user', 'admin']))
  getMyNotifications(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Notification>,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationService.getMany(
      {
        ...qs,
        where: {
          ...(qs.where || {}),
          user: { id: { $in: [user.id, null] } },
        },
      },
      gqlQuery,
    );
  }

  @Query(() => GetNotificationType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyNotificationList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Notification>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.notificationService.getMany(qs, gqlQuery);
  }

  @Query(() => Notification)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneNotification(
    @Args({ name: 'input' })
    qs: GetOneInput<Notification>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.notificationService.getOne(qs, gqlQuery);
  }

  @Mutation(() => Notification)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  async createNotification(@Args('input') input: CreateNotificationInput) {
    if (input.users) {
      for (const user of input.users) {
        await this.notificationService.create({
          ...input,
          user,
        });
      }
    }
    if (input.properties) {
      for (const property of input.properties) {
        await this.notificationService.create({
          ...input,
          property,
        });
      }
    }
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateNotification(
    @Args('id') id: string,
    @Args('input') input: UpdateNotificationInput,
  ) {
    return this.notificationService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteNotification(@Args('id') id: string) {
    return this.notificationService.delete(id);
  }
}
