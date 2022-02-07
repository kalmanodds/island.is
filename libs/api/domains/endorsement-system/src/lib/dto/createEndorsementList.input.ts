import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementListDtoTagsEnum } from '../../../gen/fetch'
import { MetadataInput } from './metadata.input'

registerEnumType(EndorsementListDtoTagsEnum, {
  name: 'EndorsementListDtoTagsEnum',
})

@InputType()
export class CreateEndorsementListDto {
  @Field()
  @IsString()
  title!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field(() => [MetadataInput])
  @ValidateNested({ each: true })
  @Type(() => MetadataInput)
  endorsementMetadata!: MetadataInput[]

  @Field(() => [EndorsementListDtoTagsEnum])
  @IsEnum(EndorsementListDtoTagsEnum, { each: true })
  tags!: EndorsementListDtoTagsEnum[]

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  meta!: object | null

  @Field(() => Date)
  closedDate!: Date

  @Field(() => Date)
  openedDate!: Date

  @Field()
  @IsBoolean()
  adminLock!: boolean
}
