import {
  BaseLicenseUpdateClient,
  BaseLicenseUpdateClientV2,
  LicenseType,
  LicenseUpdateClientService,
  PassData,
  PassDataInput as PassDataInputV2,
  PassRevocationData,
} from '@island.is/clients/license-client'
import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import {
  BarcodeData,
  BarcodeService,
  LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
  LicenseConfig,
} from '@island.is/services/license'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { Cache } from 'cache-manager'
import * as faker from 'faker'

import ShortUniqueId from 'short-unique-id'
import { BARCODE_EXPIRE_TIME_IN_SEC } from '@island.is/services/license'
import { VerifyInputData } from '../dto/verifyLicense.input'
import { LicenseService } from '../license.service'
import {
  LicenseApiVersion,
  LicenseId,
  LicenseUpdateType,
  PASS_TEMPLATE_IDS,
} from '../license.types'
import { SmartSolutionsService } from '@island.is/clients/smart-solutions-v2'
import { LicenseServiceV1 } from '../licenseV1.service'
import { LicenseServiceV2 } from '../licenseV2.service'
import { PassVerificationData } from '@island.is/clients/license-client/src/lib/licenseClient.type'

const { randomUUID } = new ShortUniqueId({ length: 16 })
const cacheStore = new Map<string, unknown>()
const licenseIds = Object.values(LicenseId)
const versions = Object.values(LicenseApiVersion)

const createCacheData = (licenseId: LicenseId): BarcodeData<LicenseType> => ({
  nationalId: faker.datatype.number({ min: 10, max: 10 }).toString(),
  licenseType: getLicenseType(licenseId),
  extraData: {
    name: faker.name.firstName(),
    nationalId: faker.datatype.number({ min: 10, max: 10 }).toString(),
  },
})

const getLicenseType = (id: LicenseId) => {
  switch (id) {
    case LicenseId.DRIVING_LICENSE:
      return LicenseType.DrivingLicense
    case LicenseId.DISABILITY_LICENSE:
      return LicenseType.DisabilityLicense
    case LicenseId.FIREARM_LICENSE:
      return LicenseType.FirearmLicense
    case LicenseId.HUNTING_LICENSE:
      return LicenseType.HuntingLicense
  }
}

@Injectable()
export class MockUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  pushUpdate = (inputData: PassDataInput, nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<Pass | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  pullUpdate = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<Pass | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<Pass | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  revoke = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: true,
        data: {
          success: true,
        },
      })
    }

    if (nationalId === 'failure') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: true,
        data: {
          success: false,
        },
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<RevokePassData>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<RevokePassData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  verify = (inputData: string) => {
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      })
    }

    const { code } = parsedInput
    if (!code) {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      })
    }

    if (code === 'success') {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: true,
        data: {
          valid: true,
        },
      })
    }

    if (code === 'failure') {
      return Promise.resolve<Result<VerifyPassData>>({
        ok: true,
        data: {
          valid: false,
        },
      })
    }
    //some other error
    return Promise.resolve<Result<VerifyPassData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }
}

@Injectable()
export class MockUpdateClientV2 extends BaseLicenseUpdateClientV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    private readonly clientService: LicenseUpdateClientService,
  ) {
    super()
  }

  pushUpdate = (inputData: PassDataInput, nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<PassData | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<PassData | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<PassData | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  pullUpdate = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<PassData | undefined>>({
        ok: true,
        data: undefined,
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<PassData | undefined>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<PassData | undefined>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  revoke = (nationalId: string) => {
    if (nationalId === 'success') {
      return Promise.resolve<Result<PassRevocationData>>({
        ok: true,
        data: {
          success: true,
        },
      })
    }

    if (nationalId === 'failure') {
      return Promise.resolve<Result<PassRevocationData>>({
        ok: true,
        data: {
          success: false,
        },
      })
    }

    if (nationalId === '') {
      return Promise.resolve<Result<PassRevocationData>>({
        ok: false,
        error: {
          code: 5,
          message: 'some user error',
        },
      })
    }
    //some other error
    return Promise.resolve<Result<PassRevocationData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }

  verify = (inputData: string) => {
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      return Promise.resolve<Result<PassVerificationData>>({
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      })
    }

    const { code } = parsedInput
    if (!code) {
      return Promise.resolve<Result<PassVerificationData>>({
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      })
    }

    if (code === 'success') {
      return Promise.resolve<Result<PassVerificationData>>({
        ok: true,
        data: {
          valid: true,
        },
      })
    }

    if (code === 'failure') {
      return Promise.resolve<Result<PassVerificationData>>({
        ok: true,
        data: {
          valid: false,
        },
      })
    }
    //some other error
    return Promise.resolve<Result<PassVerificationData>>({
      ok: false,
      error: {
        code: 99,
        message: 'some service error',
      },
    })
  }
}

describe('LicenseService', () => {
  let licenseService: LicenseService
  let barcodeService: BarcodeService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [LicenseConfig],
        }),
      ],
      providers: [
        LicenseService,
        LicenseServiceV1,
        LicenseServiceV2,
        BarcodeService,
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            debug: () => ({}),
            info: () => ({}),
            error: () => ({}),
          })),
        },
        {
          provide: LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
          useClass: jest.fn(() => ({
            get: (key: string) => cacheStore.get(key),
            set: (key: string, value: unknown) => cacheStore.set(key, value),
          })),
        },
        {
          provide: SmartSolutionsApi,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: SmartSolutionsService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: PASS_TEMPLATE_IDS,
          useValue: {
            disability: LicenseId.DISABILITY_LICENSE,
            firearm: LicenseId.FIREARM_LICENSE,
            driving: LicenseId.DRIVING_LICENSE,
          },
        },
        {
          provide: LicenseUpdateClientService,
          useFactory: (logger, smart, smartv2) => ({
            getLicenseUpdateClientByType:
              async (): Promise<BaseLicenseUpdateClient | null> =>
                new MockUpdateClient(logger, smart),
            getLicenseUpdateClientByPassTemplateId:
              async (): Promise<BaseLicenseUpdateClient | null> =>
                new MockUpdateClient(logger, smart),
            getLicenseUpdateClientV2ByType:
              async (): Promise<BaseLicenseUpdateClientV2 | null> =>
                new MockUpdateClientV2(logger, smartv2),
            getLicenseUpdateClientV2ByPassTemplateId:
              async (): Promise<BaseLicenseUpdateClientV2 | null> =>
                new MockUpdateClientV2(logger, smartv2),
          }),
          inject: [LOGGER_PROVIDER, SmartSolutionsApi, SmartSolutionsService],
        },
        {
          provide: BarcodeService,
          useFactory: () => {
            return new BarcodeService(
              {
                barcodeSecretKey: 'secret',
              } as ConfigType<typeof LicenseConfig>,
              cacheStore as unknown as Cache,
            )
          },
          inject: [LicenseConfig.KEY],
        },
      ],
    }).compile()

    licenseService = moduleRef.get<LicenseService>(LicenseService)
    barcodeService = moduleRef.get<BarcodeService>(BarcodeService)
  })

  describe.each(versions)('given version %s', (version) => {
    describe.each(licenseIds)('given %s license type id', (licenseId) => {
      describe('verify', () => {
        it(`should verify the ${licenseId} license in api version ${version}`, async () => {
          //act
          const result = await licenseService.verifyLicense({
            barcodeData: JSON.stringify({
              passTemplateId: licenseId.toString(),
              passTemplateName: licenseId.toString(),
              code: 'success',
              date: '2022-06-28T15:42:11.665950Z',
              apiVersion: version,
            }),
          })

          //assert
          expect(result).toMatchObject({
            valid: true,
          })
        })

        it(`should verify barcodeData as token for the ${licenseId} license`, async () => {
          // Act
          const code = randomUUID()
          const data =
            licenseId === LicenseId.DRIVING_LICENSE
              ? createCacheData(licenseId)
              : undefined

          // Create token
          const token = await barcodeService.createToken({
            v: '1',
            t: getLicenseType(licenseId),
            c: code,
          })

          if (data) {
            // Put data in cache
            await barcodeService.setCache(code, data)
          }

          const result = await licenseService.verifyLicense({
            barcodeData: token.token,
          })

          // Assert
          // Only driver's license is able to get extra data from the token for now
          if (licenseId !== LicenseId.DRIVING_LICENSE) {
            expect(result).toMatchObject({
              valid: false,
            })
          } else {
            expect(result).toMatchObject({
              valid: true,
              passIdentity: {
                nationalId: data?.nationalId,
                name: data?.extraData?.name,
              },
            })
          }
        })

        it(`should fail to verify barcodeData token because of token expire time for the ${licenseId} license`, async () => {
          jest.useFakeTimers({
            advanceTimers: true,
          })

          // Act
          const code = randomUUID()
          const data = createCacheData(licenseId)

          // Create token
          const token = await barcodeService.createToken({
            v: '1',
            t: getLicenseType(licenseId),
            c: code,
          })

          // Put data in cache
          await barcodeService.setCache(code, data)

          // Let the token expire
          jest.advanceTimersByTime(BARCODE_EXPIRE_TIME_IN_SEC * 1000)

          // Assert
          const result = await licenseService.verifyLicense({
            barcodeData: token.token,
          })

          expect(result).toEqual({
            valid: false,
          })
        })

        it(`should fail to verify the ${licenseId}  license in apiversion ${version}`, async () => {
          //act
          const result = await licenseService.verifyLicense({
            barcodeData: JSON.stringify({
              passTemplateId: licenseId.toString(),
              passTemplateName: licenseId.toString(),
              code: 'failure',
              date: '2022-06-28T15:42:11.665950Z',
              apiVersion: version,
            }),
          })

          //assert
          expect(result).toMatchObject({
            valid: false,
          })
        })
        it(`should throw user error on bad input when trying to verify the ${licenseId} license using version ${version}`, async () => {
          //act
          const result = licenseService.verifyLicense({
            barcodeData: JSON.stringify({
              passTemplateId: licenseId.toString(),
              passTemplateName: licenseId.toString(),
              code: '',
              date: '2022-06-28T15:42:11.665950Z',
              apiVersion: version,
            }),
          })

          //assert
          await expect(result).rejects.toThrow(
            new BadRequestException(['Invalid input data']),
          )
        })

        it(`should throw 500 error when client return an error with error code > 10 when trying to verify the ${licenseId} license using version ${version}`, async () => {
          //act
          const result = licenseService.verifyLicense({
            barcodeData: JSON.stringify({
              passTemplateId: licenseId.toString(),
              passTemplateName: licenseId.toString(),
              code: 'invalid',
              date: '2022-06-28T15:42:11.665950Z',
              apiVersion: version,
            }),
          })

          //assert
          await expect(result).rejects.toThrow(
            new InternalServerErrorException(['some service error']),
          )
        })
      })
      describe('revoke', () => {
        it(`should to revoke the ${licenseId} license using version ${version}`, async () => {
          //act
          const result = await licenseService.revokeLicense(
            licenseId,
            'success',
            { apiVersion: version },
          )

          //assert
          expect(result).toMatchObject({
            revokeSuccess: true,
          })
        })
        it(`should fail to revoke the ${licenseId} license using version ${version}`, async () => {
          //act
          const result = await licenseService.revokeLicense(
            licenseId,
            'failure',
            { apiVersion: version },
          )

          //assert
          expect(result).toMatchObject({
            revokeSuccess: false,
          })
        })
        it(`should throw user error on bad input when trying to revoke the ${licenseId} license using version ${version}`, async () => {
          //act
          const result = licenseService.revokeLicense(licenseId, '', {
            apiVersion: version,
          })

          //assert
          await expect(result).rejects.toThrow(
            new BadRequestException(['some user error']),
          )
        })
        it(`should throw server error when trying to revoke the ${licenseId} license with an invalid national id using version ${version}`, async () => {
          //act
          const result = licenseService.revokeLicense(licenseId, 'invalid', {
            apiVersion: version,
          })

          //assert
          await expect(result).rejects.toThrow(
            new InternalServerErrorException(['some service error']),
          )
        })
      })

      describe.each(Object.values(LicenseUpdateType))(
        'update %s',
        (licenseUpdateType) => {
          it(`should ${licenseUpdateType}-update the ${licenseId} license using version ${version}`, async () => {
            //act
            const result = await licenseService.updateLicense(
              licenseId,
              'success',
              {
                licenseUpdateType,
                expiryDate: '2022-01-01T00:00:00Z',
                apiVersion: version,
              },
            )

            //assert
            expect(result).toMatchObject({
              updateSuccess: true,
              data: undefined,
            })
          })
          it(`should throw user error on bad input when trying to ${licenseUpdateType}-update the ${licenseId} using version ${version} `, async () => {
            //act
            const result = licenseService.updateLicense(licenseId, '', {
              licenseUpdateType,
              expiryDate: '2022-01-01T00:00:00Z',
              apiVersion: version,
            })

            //assert
            await expect(result).rejects.toThrowError(
              new BadRequestException(['some user error']),
            )
          })
          it(`should throw server error when trying to ${licenseUpdateType}-update the ${licenseId} with an invalid national id  using version ${version}`, async () => {
            //act
            const result = licenseService.updateLicense(licenseId, 'invalid', {
              licenseUpdateType,
              expiryDate: '2022-01-01T00:00:00Z',
              apiVersion: version,
            })

            //assert
            await expect(result).rejects.toThrowError(
              new InternalServerErrorException(['some service error']),
            )
          })
        },
      )
    })
  })
})
