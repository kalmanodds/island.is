import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { FieldDtoFieldTypeEnum } from '@island.is/clients/form-system'
import { FieldSettingsInput } from './fieldSettings.input'
import { LanguageTypeInput } from './languageType.input'

registerEnumType(FieldDtoFieldTypeEnum, {
  name: 'FormSystemFieldDtoFieldTypeEnum'
})

@InputType('FormSystemFieldInput')
export class FieldInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  screenId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @Field(() => FieldSettingsInput, { nullable: true })
  fieldSettings?: FieldSettingsInput

  @Field(() => FieldDtoFieldTypeEnum, { nullable: true })
  fieldType?: FieldDtoFieldTypeEnum
}
