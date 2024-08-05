import { GraphQLJSON } from 'graphql-type-json';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  GetWalletTokenBalancesJSONResponse,
  GetWalletTokenTransfersJSONResponse,
  GetWalletTokenBalancesResponseAdapter,
} from '@moralisweb3/common-evm-utils';

@ObjectType()
export class WalletAssets {
  @Field(() => GraphQLJSON)
  tokens: GetWalletTokenBalancesJSONResponse;
}

@ObjectType()
export class TokenType {
  @Field()
  token_address: string;

  @Field()
  name: string;

  @Field()
  symbol: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  decimals: number;

  @Field()
  balance: string;

  @Field()
  possible_spam: boolean;

  @Field({ nullable: true })
  verified_collection?: boolean;
}

@ObjectType()
export class TransactionType {
  @Field()
  value: string;

  @Field()
  from: string;

  @Field()
  to: string;

  @Field()
  gas: string;

  @Field()
  id: string;

  @Field()
  time: string;
}

@ObjectType()
export class TransactionPage {
  @Field(() => GraphQLJSON)
  transactions: GetWalletTokenTransfersJSONResponse;

  @Field(() => String, { nullable: true })
  nextCursor: string | null;
}
