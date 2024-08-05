import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Vote } from './vote.entity';
import { User } from '../../user/entities/user.entity';

export enum VoteAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

registerEnumType(VoteAction, {
  name: 'VoteAction',
});

@ObjectType()
@Entity()
@Index(['vote', 'user'], { unique: true })
export class VoteEntry {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Vote)
  @ManyToOne(() => Vote, (property) => property.vote_entries, {
    eager: true,
  })
  vote: Vote;

  @Field(() => User)
  @ManyToOne(() => User, (property) => property.vote_entries, {
    eager: true,
  })
  user: User;

  @Field(() => VoteAction)
  @CreateDateColumn({
    enum: VoteAction,
    type: 'enum',
    default: VoteAction.APPROVE,
  })
  action: VoteAction;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}

@ObjectType()
export class GetVoteType {
  @Field(() => [VoteEntry], { nullable: true })
  data?: VoteEntry[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
