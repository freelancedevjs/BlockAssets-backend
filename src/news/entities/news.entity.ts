import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import slugify from 'slugify';

export enum NewsStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(NewsStatus, {
  name: 'NewsStatus',
});

@ObjectType()
@Entity()
export class News {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String)
  @Column('text')
  content: string;

  @Field(() => String)
  @Column('text')
  image: string;

  @Field(() => NewsStatus)
  @Column({
    type: 'enum',
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  status: NewsStatus;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.title) {
      this.slug = slugify(this.title);
    }
  }

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
export class GetNewsType {
  @Field(() => [News], { nullable: true })
  data?: News[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
