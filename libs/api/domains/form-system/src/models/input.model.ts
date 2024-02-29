import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/clients/form-system'
import { InputSettings } from './inputSettings.model'

@ObjectType('FormSystemInput')
export class Input {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => Object, { nullable: true })
  name?: LanguageType

  @Field(() => Object, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  guid?: string

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiSet?: boolean

  @Field(() => String, { nullable: true })
  groupGuid?: string

  @Field(() => InputSettings, { nullable: true })
  inputSettings?: InputSettings

  @Field(() => Object, { nullable: true })
  inputFields?: object
}

@ObjectType('FormSystemInputCreation')
export class CreateInput {
  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field(() => Number, { nullable: true })
  displayOrder?: number
}

@ObjectType('FormSystemInputUpdate')
export class UpdateInput {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => Object, { nullable: true })
  name?: LanguageType

  @Field(() => Object, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => InputSettings, { nullable: true })
  inputSettings?: object

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiSet?: boolean
}

