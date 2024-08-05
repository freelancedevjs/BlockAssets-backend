import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DisclosureService } from './disclosure.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import {
  GetDisclosureType,
  Disclosure,
  DisclosureStatus,
} from './entities/disclosure.entity';
import {
  CreateDisclosureInput,
  UpdateDisclosureInput,
} from './inputs/disclosure.input';

@Resolver()
export class DisclosureResolver {
  constructor(private readonly disclosureService: DisclosureService) {}

  @Query(() => GetDisclosureType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyDisclosureList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Disclosure>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.disclosureService.getMany(qs, gqlQuery);
  }

  @Query(() => Disclosure)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneDisclosure(
    @Args({ name: 'input' })
    qs: GetOneInput<Disclosure>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.disclosureService.getOne(qs, gqlQuery);
  }

  @Query(() => GetDisclosureType)
  getDisclosures(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Disclosure>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.disclosureService.getMany(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: DisclosureStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Query(() => Disclosure)
  getDisclosure(
    @Args({ name: 'input' })
    qs: GetOneInput<Disclosure>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.disclosureService.getOne(
      {
        ...(qs || {}),
        where: { ...(qs?.where || {}), status: DisclosureStatus.PUBLISHED },
      },
      gqlQuery,
    );
  }

  @Mutation(() => Disclosure)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createDisclosure(@Args('input') input: CreateDisclosureInput) {
    return this.disclosureService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateDisclosure(
    @Args('id') id: string,
    @Args('input') input: UpdateDisclosureInput,
  ) {
    return this.disclosureService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteDisclosure(@Args('id') id: string) {
    return this.disclosureService.delete(id);
  }
}
