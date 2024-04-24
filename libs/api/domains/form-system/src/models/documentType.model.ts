import { Field, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'

@ObjectType('FormSystemDocumentType')
export class DocumentType {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType
}
