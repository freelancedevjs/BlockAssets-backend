import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VoteService } from './vote.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import GraphQLJSON from 'graphql-type-json';
import { GetVoteType, Vote } from './entities/vote.entity';
import {
  CreateVoteEntryInput,
  CreateVoteInput,
  UpdateVoteInput,
  VoteIdInput,
} from './inputs/vote.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
@Resolver()
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Query(() => GetVoteType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyVoteList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Vote>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.voteService.getMany(qs, gqlQuery);
  }

  @Query(() => Vote)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneVote(
    @Args({ name: 'input' })
    qs: GetOneInput<Vote>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.voteService.getOne(qs, gqlQuery);
  }

  @Query(() => GetVoteType)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getMyVotes(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<Vote>,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.voteService.getMany(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
          property: {
            subscriptions: {
              user: { id: user.id },
            },
          },
        },
      },
      gqlQuery,
    );
  }
  @Query(() => Vote)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getMyVote(
    @Args({ name: 'input', nullable: true })
    qs: GetOneInput<Vote>,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.voteService.getOne(
      {
        ...(qs || {}),
        where: {
          ...(qs.where || {}),
          property: {
            subscriptions: {
              user: { id: user.id },
            },
          },
        },
      },
      gqlQuery,
    );
  }
  @Query(() => Vote)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  getVoteProgress(
    @Args({ name: 'input', nullable: true })
    qs: VoteIdInput,
    @CurrentQuery() gqlQuery: string,
    @CurrentUser() user: User,
  ) {
    return this.voteService.getVoteProgress(qs);
  }

  @Mutation(() => Vote)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createVote(@Args('input') input: CreateVoteInput) {
    return this.voteService.create(input);
  }
  @Mutation(() => Vote)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  createVoteEntry(
    @Args('input') input: CreateVoteEntryInput,
    @CurrentUser() user: User,
  ) {
    return this.voteService.createEntry(input, user);
  }
  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  async updateVoteEntry(
    @Args('input') input: CreateVoteEntryInput,
    @CurrentUser() user: User,
  ) {
    return await this.voteService.updateEntry(input, user);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateVote(@Args('id') id: string, @Args('input') input: UpdateVoteInput) {
    return this.voteService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteVote(@Args('id') id: string) {
    return this.voteService.delete(id);
  }
}
