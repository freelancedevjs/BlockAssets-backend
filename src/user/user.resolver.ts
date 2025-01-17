import { CurrentUser } from '../common/decorators/user.decorator';
import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import GraphQLJSON from 'graphql-type-json';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { GetUserType, User } from './entities/user.entity';
import {
  CreateUserInput,
  UpdateUserAdminInput,
  UpdateUserInput,
} from './inputs/user.input';
import { CurrentQuery } from 'src/common/decorators/query.decorator';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletInput } from './inputs/wallet.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetUserType)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getManyUserList(
    @Args({ name: 'input', nullable: true })
    qs: GetManyInput<User>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.userService.getMany(qs, gqlQuery);
  }

  @Query(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOneUser(
    @Args({ name: 'input' })
    qs: GetOneInput<User>,
    @CurrentQuery() gqlQuery: string,
  ) {
    return this.userService.getOne(qs, gqlQuery);
  }

  @Mutation(() => User)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserAdminInput,
  ) {
    return this.userService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard(['admin', 'user']))
  updateMe(@CurrentUser() user: User, @Args('input') input: UpdateUserInput) {
    return this.userService.updateEmail(user, input);
  }

  @Mutation(() => GraphQLJSON)
  @UseGuards(new GraphqlPassportAuthGuard('admin'))
  deleteUser(@Args('id') id: string) {
    return this.userService.delete(id);
  }

  @Query(() => User)
  @UseGuards(new GraphqlPassportAuthGuard(['admin', 'user']))
  getMe(@CurrentUser() user: User) {
    return this.userService.getOne({
      where: { id: user.id },
    });
  }

  @Mutation(() => Wallet)
  @UseGuards(new GraphqlPassportAuthGuard(['admin', 'user']))
  updateWallet(
    @CurrentUser() user: User,
    @Args('privateKey') privateKey: CreateWalletInput,
  ): Promise<Wallet> {
    try {
      return this.userService.updateWallet(user, privateKey);
    } catch (error) {
      throw new Error(error);
    }
  }
}
