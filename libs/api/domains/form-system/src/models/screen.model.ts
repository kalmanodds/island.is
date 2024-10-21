import { Field, ObjectType, Int } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Field as FieldModel } from './field.model'

@ObjectType('FormSystemScreen')
export class Screen {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Int, { nullable: true })
  multiset?: number

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean

  @Field(() => [FieldModel], { nullable: 'itemsAndList' })
  fields?: FieldModel[]
}
