import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope, LicenseApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import type { Locale } from '@island.is/shared/types'
import { ForbiddenException, UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CreateBarcodeResult } from '../dto/CreateBarcodeResult.dto'
import { GenericUserLicense } from '../dto/GenericUserLicense.dto'
import {
  ApiVersion,
  GetGenericLicenseInput,
} from '../dto/GetGenericLicense.input'
import { LicenseService } from '../licenseService.service'
import { GenericLicenseError } from '../dto/GenericLicenseError.dto'
import { LicenseServiceV2 } from '../licenseServiceV2.service'
import { UserLicenseResponse } from '../licenceService.type'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver(() => GenericUserLicense)
@Audit({ namespace: '@island.is/api/license-service' })
export class UserLicenseResolver {
  constructor(
    private readonly licenseServiceService: LicenseService,
    private readonly licenseServiceV2: LicenseServiceV2,
  ) {}

  @Query(() => GenericUserLicense, {
    nullable: true,
  })
  @Audit()
  async genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ): Promise<UserLicenseResponse | null> {
    const service =
      input.apiVersion === ApiVersion.Second
        ? this.licenseServiceV2
        : this.licenseServiceService

    const license = await service.getLicense(
      user,
      locale,
      input.licenseType,
      input.licenseId,
    )
    if (license instanceof GenericLicenseError) {
      return null
    }

    if (license instanceof GenericUserLicense) {
      return {
        ...license,
        apiVersion: input.apiVersion,
      }
    }
    return license
  }

  @ResolveField('barcode', () => CreateBarcodeResult, { nullable: true })
  async resolveBarcode(
    @CurrentUser() user: User,
    @Parent() genericUserLicense: UserLicenseResponse,
  ): Promise<CreateBarcodeResult | null> {
    if (!user.scope.includes(LicenseApiScope.licensesBarcode)) {
      throw new ForbiddenException(
        'User does not have permission to create barcode',
      )
    }

    if (genericUserLicense.apiVersion === ApiVersion.Second) {
      return this.licenseServiceV2.createBarcode(user, genericUserLicense)
    }

    return this.licenseServiceService.createBarcode(user, genericUserLicense)
  }
}
