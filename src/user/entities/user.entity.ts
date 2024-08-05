import { IsEmail, IsOptional } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { Wallet } from './wallet.entity';
import { Page } from '../../page/entities/page.entity';
import { PropertyNotification } from '../../property/entities/property-notification.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { VoteEntry } from '../../vote/entities/vote-entry.entity';

const BCRYPT_HASH_ROUNDS = 10;

export enum UserType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

registerEnumType(UserType, {
  name: 'UserType',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Field(() => String)
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @IsEmail()
  @Column({ nullable: true })
  new_email: string;

  @Field(() => String)
  @Column({ unique: true })
  phone: string;

  @Field(() => UserType)
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.INDIVIDUAL,
  })
  userType: UserType;

  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column()
  role: 'admin' | 'user';

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  firstName: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  lastName: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  companyName: string;

  @Field()
  @Column('text')
  address: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  postalCode: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ default: true })
  marketing: boolean;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  dob: Date;

  @Field()
  @Column('boolean')
  tnc_status: boolean;

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

  @Field(() => Wallet, { nullable: true })
  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    nullable: true,
    lazy: true,
    cascade: ['remove'],
  })
  wallet?: Promise<Wallet>;

  @Field(() => [Page], { nullable: true })
  @OneToMany(() => Page, (page) => page.user, {
    nullable: true,
    lazy: true,
  })
  pages: Promise<Page[]>;

  @Field(() => [VoteEntry], { nullable: true })
  @OneToMany(() => VoteEntry, (page) => page.user, {
    nullable: true,
    lazy: true,
  })
  vote_entries: Promise<VoteEntry[]>;

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (page) => page.user, {
    nullable: true,
    lazy: true,
  })
  subscriptions: Promise<Subscription[]>;

  @Field(() => [PropertyNotification], { nullable: true })
  @OneToMany(
    () => PropertyNotification,
    (property_notification) => property_notification.user,
    {
      nullable: true,
      lazy: true,
      cascade: ['remove'],
    },
  )
  property_notifications: Promise<PropertyNotification[]>;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(
    () => Notification,
    (property_notification) => property_notification.user,
    {
      nullable: true,
      lazy: true,
      cascade: ['remove'],
    },
  )
  notifications: Promise<Notification[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, BCRYPT_HASH_ROUNDS);
    }
  }

  @BeforeInsert()
  beforeInsert() {
    if (!this.role) {
      this.role = 'user';
    }
  }
}

@ObjectType()
export class GetUserType {
  @Field(() => [User], { nullable: true })
  data?: User[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
