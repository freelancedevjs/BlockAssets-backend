import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../entities/notice.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { PropertyIdInput } from '../../property/inputs/property.input';

@InputType()
export class CreateNoticeInput {
  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  content: string;

  @Field(() => NoticeStatus, { nullable: true })
  @IsOptional()
  status?: NoticeStatus;

  @Field(() => NoticeCategory, { nullable: true })
  @IsOptional()
  category?: NoticeCategory;

  @Field(() => PropertyIdInput, { nullable: true })
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;
}

@InputType()
export class UpdateNoticeInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => NoticeStatus, { nullable: true })
  @IsOptional()
  status?: NoticeStatus;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;

  @Field(() => PropertyIdInput, { nullable: true })
  @IsOptional()
  property?: PropertyIdInput;

  @Field(() => NoticeCategory, { nullable: true })
  @IsOptional()
  category?: NoticeCategory;
}
