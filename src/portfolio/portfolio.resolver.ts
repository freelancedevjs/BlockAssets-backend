import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PortfolioService } from './portfolio.service';
import {
  TokenType,
  TransactionPage,
  TransactionType,
  WalletAssets,
} from './portfolio.types';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlPassportAuthGuard } from '../common/guards/graphql-passport-auth.guard';
import { CreateNotificationInput } from '../notification/inputs/notification.input';
import { CursorInput, SendFundsInput } from './inputs/portfolio.input';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Query(() => WalletAssets)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  async getWalletBalances(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input?: CursorInput,
  ): Promise<WalletAssets> {
    try {
      return this.portfolioService.getWalletBalances(user.id, input);
    } catch (error) {
      throw new Error(`Error fetching wallet balances: ${error.message}`);
    }
  }

  @Query(() => [TransactionPage])
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  async getWalletTransactions(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input?: CursorInput,
  ): Promise<TransactionPage> {
    try {
      return await this.portfolioService.getWalletTransactions(user.id, input);
    } catch (error) {
      throw new Error(`Error fetching wallet balances: ${error.message}`);
    }
  }

  @Mutation(() => String)
  @UseGuards(new GraphqlPassportAuthGuard('user'))
  async sendFunds(
    @CurrentUser() user: User,
    @Args('input') input: SendFundsInput,
  ): Promise<string> {
    try {
      return await this.portfolioService.sendWalletBalances(user.id, input);
    } catch (error) {
      throw new Error(`Error sending wallet balance: ${error.message}`);
    }
  }
}
