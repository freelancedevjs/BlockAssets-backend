import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Property } from './property.entity';

@ObjectType()
@Entity()
export class PropertyImage {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.images, { eager: true })
  property: Property;

  @Field(() => String)
  @Column()
  url: string;

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
export class GetPropertyImageType {
  @Field(() => [PropertyImage], { nullable: true })
  data?: PropertyImage[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
