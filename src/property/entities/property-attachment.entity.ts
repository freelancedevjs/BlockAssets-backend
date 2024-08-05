import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Property } from './property.entity';

export enum PropertyAttachmentStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(PropertyAttachmentStatus, {
  name: 'PropertyAttachmentStatus',
});

@ObjectType()
@Entity()
export class PropertyAttachment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.attachments, {
    eager: true,
  })
  property: Property;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => PropertyAttachmentStatus)
  @Column({
    type: 'enum',
    default: PropertyAttachmentStatus.PUBLISHED,
    enum: PropertyAttachmentStatus,
  })
  status: PropertyAttachmentStatus;

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
export class GetPropertyAttachmentType {
  @Field(() => [PropertyAttachment], { nullable: true })
  data?: PropertyAttachment[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
