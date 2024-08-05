import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWalletInput {
  @Field(() => String)
  @IsNotEmpty()
  private_key: string;
}
