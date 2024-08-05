import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Property } from '../../property/entities/property.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class Subscription {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.subscriptions, {
    eager: true,
  })
  property: Property;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.subscriptions, {
    eager: true,
  })
  user: User;

  @Field(() => Number)
  @Column()
  amount: number;

  @Field(() => Number)
  @Column()
  warranty: number;

  @Field(() => Number)
  @Column({ default: 0 })
  deposit_amount: number;

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
export class GetSubscriptionType {
  @Field(() => [Subscription], { nullable: true })
  data?: Subscription[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
