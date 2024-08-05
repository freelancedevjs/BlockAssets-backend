import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import { GetNoticeType, Notice, NoticeStatus } from './entities/notice.entity';
import { CreateNoticeInput, UpdateNoticeInput } from './inputs/notice.input';

@Resolver()
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService) {}

  @Query(() => GetNoticeType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyNoticeList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Notice>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.noticeService.getMany(qs, gqlQuery);
  }

  @Query(() => GetNoticeType)
  getManyNotices(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Notice>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.noticeService.getMany(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: NoticeStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => Notice)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneNotice(
    @Args({ name: 'input' })
    qs: GetOneInput<Notice>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.noticeService.getOne(qs, gqlQuery);
  }

  @Query(() => Notice)
  getNotice(
    @Args({ name: 'input' })
    qs: GetOneInput<Notice>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.noticeService.getOne(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: NoticeStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Mutation(() => Notice)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  async createNotice(@Args('input') input: CreateNoticeInput) {
    return await this.noticeService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateNotice(
    @Args('id') id: number,
    @Args('input') input: UpdateNoticeInput,
  ) {
    return this.noticeService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteNotice(@Args('id') id: number) {
    return this.noticeService.delete(id);
  }
}
