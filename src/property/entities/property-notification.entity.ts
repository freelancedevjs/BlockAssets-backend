import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Property } from './property.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
@Index(['property', 'user'], { unique: true })
export class PropertyNotification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.notifications, {
    eager: true,
  })
  property: Property;

  @ManyToOne(() => User, (user) => user.property_notifications, {
    eager: true,
  })
  user: User;

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
export class GetPropertyNotificationType {
  @Field(() => [PropertyNotification], { nullable: true })
  data?: PropertyNotification[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
