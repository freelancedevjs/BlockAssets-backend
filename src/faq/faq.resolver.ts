import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import { Faq, FaqStatus, GetFaqType } from './entities/faq.entity';
import { CreateFaqInput, UpdateFaqInput } from './inputs/faq.input';

@Resolver()
export class FaqResolver {
  constructor(private readonly faqService: FaqService) {}

  @Query(() => GetFaqType)
  getFaqs(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Faq>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.faqService.getMany(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: FaqStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => GetFaqType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyFaqList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Faq>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.faqService.getMany(qs, gqlQuery);
  }

  @Query(() => Faq)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneFaq(
    @Args({ name: 'input' })
    qs: GetOneInput<Faq>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.faqService.getOne(qs, gqlQuery);
  }

  @Mutation(() => Faq)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createFaq(@Args('input') input: CreateFaqInput) {
    return this.faqService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateFaq(@Args('id') id: number, @Args('input') input: UpdateFaqInput) {
    return this.faqService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteFaq(@Args('id') id: number) {
    return this.faqService.delete(id);
  }
}
