import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'

export enum ApiVersion {
  First,
  Second,
}

registerEnumType(ApiVersion, { name: 'LicenseServiceApiVersion' })

@InputType()
export class GetGenericLicenseInput {
  @Field(() => String)
  licenseType!: GenericLicenseType

  @Field({ nullable: true })
  licenseId?: string

  @Field(() => ApiVersion, { nullable: true })
  apiVersion?: ApiVersion
}
