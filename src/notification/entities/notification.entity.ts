import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Property } from '../../property/entities/property.entity';
import { User } from '../../user/entities/user.entity';

export enum NotificationCategory {
  DIVIDEND = 'dividend',
  SUBSCRIPTION = 'subscription',
  OTHER = 'other',
  PROPERTY = 'property',
}

registerEnumType(NotificationCategory, {
  name: 'NotificationCategory',
});

export enum NotificationMode {
  EMAIL = 'email',
  SMS = 'sms',
  ALL = 'all',
}

registerEnumType(NotificationMode, {
  name: 'NotificationMode',
});

@ObjectType()
@Entity()
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property, { nullable: true })
  @ManyToOne(() => Property, (property) => property.user_notifications, {
    lazy: true,
    nullable: true,
  })
  property: Property;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (property) => property.notifications, {
    lazy: true,
    nullable: true,
  })
  user: User;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => NotificationCategory)
  @Column({
    type: 'enum',
    enum: NotificationCategory,
    default: NotificationCategory.OTHER,
  })
  category: NotificationCategory;

  @Field(() => NotificationMode)
  @Column({
    type: 'enum',
    enum: NotificationMode,
    default: NotificationMode.ALL,
  })
  mode: NotificationMode;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  readAt: Date;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}

@ObjectType()
export class GetNotificationType {
  @Field(() => [Notification], { nullable: true })
  data?: Notification[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
