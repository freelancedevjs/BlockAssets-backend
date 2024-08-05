import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import slugify from 'slugify';
import { User } from '../../user/entities/user.entity';
import { ExposeForAdmin } from '../../common/decorators/user.decorator';
import { Exclude } from 'class-transformer';

export enum PageStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(PageStatus, {
  name: 'PageStatus',
});

@ObjectType()
@Entity()
export class Page {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String)
  @Column('text')
  content: string;

  @Field(() => PageStatus)
  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.DRAFT,
  })
  status: PageStatus;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.pages)
  @Exclude()
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}

@ObjectType()
export class GetPageType {
  @Field(() => [Page], { nullable: true })
  data?: Page[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
