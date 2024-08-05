import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageService } from './page.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import { GetPageType, Page, PageStatus } from './entities/page.entity';
import { CreatePageInput, UpdatePageInput } from './inputs/page.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver()
export class PageResolver {
  constructor(private readonly pageService: PageService) {}

  @Query(() => GetPageType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyPageList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Page>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.pageService.getMany(qs, gqlQuery);
  }

  @Query(() => Page)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOnePage(
    @Args({ name: 'input' })
    qs: GetOneInput<Page>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.pageService.getOne(qs, gqlQuery);
  }

  @Query(() => GetPageType)
  getPages(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Page>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.pageService.getMany(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
          status: PageStatus.PUBLISHED,
        },
      },
      gqlQuery,
    );
  }

  @Query(() => Page)
  @UseInterceptors(ClassSerializerInterceptor)
  getPage(
    @Args({ name: 'input' })
    slug: string,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.pageService.getOne(
      { where: { slug: slug, status: PageStatus.PUBLISHED } },
      gqlQuery,
    );
  }

  @Mutation(() => Page)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createPage(@Args('input') input: CreatePageInput, @CurrentUser() user: User) {
    return this.pageService.create(input, user);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updatePage(@Args('id') id: number, @Args('input') input: UpdatePageInput) {
    return this.pageService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deletePage(@Args('id') id: number) {
    return this.pageService.delete(id);
  }
}
