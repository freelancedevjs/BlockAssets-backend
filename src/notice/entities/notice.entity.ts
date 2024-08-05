import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import slugify from 'slugify';
import { Property } from '../../property/entities/property.entity';

export enum NoticeStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(NoticeStatus, {
  name: 'NoticeStatus',
});

export enum NoticeCategory {
  DIVIDEND = 'dividend',
  SUBSCRIPTION = 'subscription',
  OTHER = 'other',
  PROPERTY = 'property',
}

registerEnumType(NoticeCategory, {
  name: 'NoticeCategory',
});

@ObjectType()
@Entity()
export class Notice {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => Property, { nullable: true })
  @ManyToOne(() => Property, (property) => property.notices, {
    lazy: true,
    nullable: true,
  })
  property: Property;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String)
  @Column('text')
  content: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  image: string;

  @Field(() => NoticeStatus)
  @Column({
    type: 'enum',
    enum: NoticeStatus,
    default: NoticeStatus.DRAFT,
  })
  status: NoticeStatus;

  @Field(() => NoticeCategory)
  @Column({
    type: 'enum',
    enum: NoticeCategory,
    default: NoticeCategory.OTHER,
  })
  category: NoticeCategory;

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
  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.title) {
      this.slug = slugify(this.title);
    }
  }
}

@ObjectType()
export class GetNoticeType {
  @Field(() => [Notice], { nullable: true })
  data?: Notice[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
