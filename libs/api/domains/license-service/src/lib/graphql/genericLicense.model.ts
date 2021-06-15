import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Payload } from './payload.model'

import {
  GenericLicenseType,
  GenericUserLicenseStatus,
  GenericUserLicenseFetchStatus,
  GenericLicenseProviderId,
} from '../licenceService.type'
import { IsOptional } from 'class-validator'

registerEnumType(GenericLicenseType, {
  name: 'GenericLicenseType',
  description: 'Exhaustive list of license types',
})

registerEnumType(GenericLicenseProviderId, {
  name: 'GenericLicenseProviderId',
  description: 'Exhaustive list of license provider IDs',
})

registerEnumType(GenericUserLicenseStatus, {
  name: 'GenericUserLicenseStatus',
  description: 'Possible license statuses for user',
})

registerEnumType(GenericUserLicenseFetchStatus, {
  name: 'GenericUserLicenseFetchStatus',
  description: 'Possible license fetch statuses',
})

@ObjectType()
export class GenericLicenseProvider {
  @Field(() => GenericLicenseProviderId, {
    description: 'ID of license provider',
  })
  id!: GenericLicenseProviderId
}

@ObjectType()
export class GenericLicense {
  @Field(() => GenericLicenseType, {
    description: 'Type of license from an exhaustive list',
  })
  type!: GenericLicenseType

  @Field(() => GenericLicenseProvider, {
    description: 'Provider of the license',
  })
  provider!: GenericLicenseProvider

  @Field({ description: 'Does the license support pkpass?' })
  pkpass!: boolean

  @Field({
    description:
      'How long the data about the license should be treated as fresh',
  })
  timeout!: number

  @Field(() => GenericUserLicenseStatus, { description: 'Status of license' })
  status!: GenericUserLicenseStatus
}

@ObjectType()
export class GenericLicenseFetch {
  @Field(() => GenericUserLicenseFetchStatus, {
    description: 'Status of license fetch',
  })
  status!: GenericUserLicenseFetchStatus

  @Field({ description: 'Datetime of last update of fetch status' })
  updated!: string
}

@ObjectType()
export class GenericUserLicense {
  @Field({ description: 'National ID of license owner' })
  nationalId!: string

  @Field(() => GenericLicense, { description: 'License info' })
  license!: GenericLicense

  @Field(() => GenericLicenseFetch, { description: 'Info about license fetch' })
  fetch!: GenericLicenseFetch

  @Field({
    nullable: true,
    description: 'Possible URL of pkpass version of license',
  })
  pkpassUrl?: string

  @Field(() => Payload, {
    nullable: true,
    description: 'Potential payload of license, both parsed and raw',
  })
  payload?: Payload
}
