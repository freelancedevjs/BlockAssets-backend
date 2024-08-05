import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { PropertyAttachment } from './property-attachment.entity';
import slugify from 'slugify';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Disclosure } from '../../disclosure/entities/disclosure.entity';
import { PropertyImage } from './property-image.entity';
import { Vote } from '../../vote/entities/vote.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import GraphQLJSON from 'graphql-type-json';
import { PropertyNotification } from './property-notification.entity';
import { Notice } from '../../notice/entities/notice.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Factory } from 'nestjs-seeder';

export enum PropertyStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  CLOSED = 'closed',
}

registerEnumType(PropertyStatus, {
  name: 'PropertyStatus',
});

@ObjectType()
export class GrossFloorArea {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  case: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  total: string;
}

@ObjectType()
export class GrossLandArea {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  case: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  total: string;
}

@ObjectType()
export class PropertyBasicInformation {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  zoning: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  floor: string;

  @Field(() => String)
  @IsDate()
  @IsNotEmpty()
  completion_date: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  government_land_value: string;

  @Field(() => GrossFloorArea)
  @IsNotEmpty()
  gross_floor_area: GrossFloorArea;

  @Field(() => GrossLandArea)
  @IsNotEmpty()
  land_area: GrossLandArea;
}

@ObjectType()
export class PropertySubscriptionInformation {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  total_cap: number;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  apr: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  allocation_date: Date;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  listing_date: Date;
}

@ObjectType()
@Entity()
export class Property {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.location.street())
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  slug: string;

  @Factory((faker) => faker.lorem.paragraph())
  @Field(() => String)
  @Column()
  content: string;

  @Factory((faker) => faker.finance.ethereumAddress())
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  somi_cold_wallet_address?: string;

  @Factory((faker) => faker.finance.ethereumAddress())
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  usdt_cold_wallet_address?: string;

  @Factory((faker) => faker.finance.ethereumAddress())
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  dividend_address?: string;

  @Factory((faker) =>
    faker.helpers.arrayElement([
      PropertyStatus.PUBLISHED,
      PropertyStatus.DRAFT,
      PropertyStatus.CLOSED,
    ]),
  )
  @Field(() => PropertyStatus)
  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.DRAFT,
  })
  status: PropertyStatus;

  @Field(() => GraphQLJSON)
  @Column('simple-json')
  basic_info: PropertyBasicInformation;

  @Field(() => GraphQLJSON)
  @Column('simple-json')
  subscription_info: PropertySubscriptionInformation;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  startsAt: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  endsAt: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  firstDepositDate: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  secondDepositDate: Date;

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

  @Field(() => [Disclosure], { nullable: true })
  @OneToMany(() => Disclosure, (disclosure) => disclosure.property, {
    nullable: true,
    lazy: true,
  })
  disclosures: Promise<Disclosure[]>;

  @Field(() => [PropertyNotification], { nullable: true })
  @OneToMany(() => PropertyNotification, (disclosure) => disclosure.property, {
    nullable: true,
    lazy: true,
  })
  notifications: Promise<PropertyNotification[]>;

  @Field(() => [Vote], { nullable: true })
  @OneToMany(() => Vote, (vote) => vote.property, {
    nullable: true,
    lazy: true,
  })
  votes: Promise<Vote[]>;

  @Field(() => [Notice], { nullable: true })
  @OneToMany(() => Notice, (vote) => vote.property, {
    nullable: true,
    lazy: true,
  })
  notices: Promise<Notice[]>;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (vote) => vote.property, {
    nullable: true,
    lazy: true,
  })
  user_notifications: Promise<Notification[]>;

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (vote) => vote.property, {
    nullable: true,
    lazy: true,
  })
  subscriptions: Promise<Subscription[]>;

  @Field(() => [PropertyAttachment], { nullable: true })
  @OneToMany(() => PropertyAttachment, (attachment) => attachment.property, {
    nullable: true,
    lazy: true,
  })
  attachments: Promise<PropertyAttachment[]>;

  @Field(() => [PropertyImage], { nullable: true })
  @OneToMany(() => PropertyImage, (attachment) => attachment.property, {
    nullable: true,
    lazy: true,
  })
  images: Promise<PropertyImage[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}

@ObjectType()
export class GetPropertyType {
  @Field(() => [Property], { nullable: true })
  data?: Property[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
