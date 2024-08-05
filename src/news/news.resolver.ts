import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import { GetNewsType, News, NewsStatus } from './entities/news.entity';
import { CreateNewsInput, UpdateNewsInput } from './inputs/news.input';

@Resolver()
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => News)
  getNews(
    @Args({ name: 'input' })
    qs: GetOneInput<News>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.newsService.getOne(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: NewsStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => GetNewsType)
  getManyNews(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<News>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.newsService.getMany(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: NewsStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => GetNewsType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyNewsList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<News>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.newsService.getMany(qs, gqlQuery);
  }

  @Query(() => News)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneNews(
    @Args({ name: 'input' })
    qs: GetOneInput<News>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.newsService.getOne(qs, gqlQuery);
  }

  @Mutation(() => News)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createNews(@Args('input') input: CreateNewsInput) {
    return this.newsService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateNews(@Args('id') id: string, @Args('input') input: UpdateNewsInput) {
    return this.newsService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteNews(@Args('id') id: string) {
    return this.newsService.delete(id);
  }
}
