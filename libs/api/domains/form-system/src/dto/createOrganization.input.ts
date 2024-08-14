import { Field, InputType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationInput {
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string
}
