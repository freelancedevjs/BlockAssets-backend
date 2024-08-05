import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Property } from '../../property/entities/property.entity';
import { Factory } from 'nestjs-seeder';
import slugify from 'slugify';
import { isFuture } from 'date-fns';
import { VoteEntry } from './vote-entry.entity';

@ObjectType()
@Entity()
export class Vote {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.votes, {
    eager: true,
  })
  property: Property;

  @Field(() => [VoteEntry], { nullable: true })
  @OneToMany(() => VoteEntry, (property) => property.vote, {
    lazy: true,
    nullable: true,
  })
  vote_entries: Promise<VoteEntry[]>;

  @Field(() => String)
  @Column()
  @Factory((faker) => faker.company.name())
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String)
  @Column()
  @Factory((faker) =>
    faker.lorem.paragraphs(
      faker.number.int({
        max: 10,
        min: 4,
      }),
    ),
  )
  content: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  @Factory((faker) =>
    faker.helpers.arrayElement([
      faker.date.soon({ days: 5 }),
      faker.date.recent({ days: 5 }),
    ]),
  )
  startsAt: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  @Factory((faker, ctx) => {
    return isFuture(ctx.startsAt)
      ? faker.date.soon({ days: 5 })
      : faker.date.recent({ days: 5 });
  })
  endsAt: Date;

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

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsertOrUpdate() {
    if (this.name) {
      this.slug = slugify(this.name).toLowerCase();
    }
  }
}

@ObjectType()
export class GetVoteType {
  @Field(() => [Vote], { nullable: true })
  data?: Vote[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
