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
import { Property } from '../../property/entities/property.entity';
import slugify from 'slugify';

export enum DisclosureStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(DisclosureStatus, {
  name: 'DisclosureStatus',
});

@ObjectType()
@Entity()
export class Disclosure {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Property)
  @ManyToOne(() => Property, (property) => property.disclosures, {
    eager: true,
  })
  property: Property;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  slug: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => DisclosureStatus)
  @Column({
    type: 'enum',
    enum: DisclosureStatus,
    default: DisclosureStatus.DRAFT,
  })
  status: DisclosureStatus;

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
      this.slug = slugify(this.name);
    }
  }
}

@ObjectType()
export class GetDisclosureType {
  @Field(() => [Disclosure], { nullable: true })
  data?: Disclosure[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
