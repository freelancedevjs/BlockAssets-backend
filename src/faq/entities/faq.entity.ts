import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum FaqStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

registerEnumType(FaqStatus, {
  name: 'FaqStatus',
});

@ObjectType()
@Entity()
export class Faq {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column('text')
  content: string;

  @Field(() => FaqStatus)
  @Column({
    type: 'enum',
    enum: FaqStatus,
    default: FaqStatus.DRAFT,
  })
  status: FaqStatus;
}

@ObjectType()
export class GetFaqType {
  @Field(() => [Faq], { nullable: true })
  data?: Faq[];

  @Field(() => Number, { nullable: true })
  count?: number;
}
