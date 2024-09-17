import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import times from 'lodash/times'
import request from 'supertest'

import {
  ApiScope,
  ApiScopeDelegationType,
  Delegation,
  DelegationProviderModel,
  DelegationScope,
  DelegationsIndexService,
  DelegationTypeModel,
  Domain,
  InactiveReason,
  MergedDelegationDTO,
  PersonalRepresentative,
  PersonalRepresentativeDelegationTypeModel,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeType,
  UNKNOWN_NAME,
} from '@island.is/auth-api-lib'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  createClient,
  createDomain,
  FixtureFactory,
} from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
  getPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { defaultScopes, setupWithAuth } from '../../../test/setup'
import {
  getFakeName,
  getFakeNationalId,
  NameIdTuple,
} from '../../../test/stubs/genericStubs'
import {
  delegationTypes,
  getPersonalRepresentativeRelationship,
  getPersonalRepresentativeRights,
  getPersonalRepresentativeRightType,
  getScopePermission,
  personalRepresentativeType,
} from '../../../test/stubs/personalRepresentativeStubs'
import { DelegationDelegationType } from '../../../../../../../libs/auth-api-lib/src/lib/delegations/models/delegation-delegation-type.model'
import { uuid } from 'uuidv4'
import addDays from 'date-fns/addDays'

describe('DelegationsController', () => {
  describe('Given a user is authenticated', () => {
    let app: TestApp
    let factory: FixtureFactory
    let server: request.SuperTest<request.Test>
    let apiScopeModel: typeof ApiScope
    let prScopePermission: typeof PersonalRepresentativeScopePermission
    let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType
    let prModel: typeof PersonalRepresentative
    let prRightsModel: typeof PersonalRepresentativeRight
    let prRightTypeModel: typeof PersonalRepresentativeRightType
    let prTypeModel: typeof PersonalRepresentativeType
    let prDelegationTypeModel: typeof PersonalRepresentativeDelegationTypeModel
    let delegationDelegationTypeModelModel: typeof DelegationDelegationType
    let delegationModel: typeof Delegation
    let delegationTypeModel: typeof DelegationTypeModel
    let nationalRegistryApi: NationalRegistryClientService
    let delegationProviderModel: typeof DelegationProviderModel
    let delegationIndexService: DelegationsIndexService
    let delegationScopesModel: typeof DelegationScope

    const client = createClient({
      clientId: '@island.is/webapp',
    })

    const scopeValid1 = 'scope/valid1'
    const scopeValid2 = 'scope/valid2'
    const scopeValid1and2 = 'scope/valid1and2'
    const scopeUnactiveType = 'scope/unactiveType'
    const scopeOutdated = 'scope/outdated'
    const disabledScope = 'disabledScope'

    client.allowedScopes = Object.values([
      scopeValid1,
      scopeValid2,
      scopeValid1and2,
      scopeUnactiveType,
      scopeOutdated,
      disabledScope,
    ]).map((s) => ({
      clientId: client.clientId,
      scopeName: s,
    }))

    const userNationalId = getFakeNationalId()

    const user = createCurrentUser({
      nationalId: userNationalId,
      scope: [defaultScopes.testUserHasAccess.name],
      client: client.clientId,
    })

    const domain = createDomain()

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      prTypeModel = app.get<typeof PersonalRepresentativeType>(
        getModelToken(PersonalRepresentativeType),
      )

      await prTypeModel.create(personalRepresentativeType)

      const domainModel = app.get<typeof Domain>(getModelToken(Domain))
      await domainModel.create(domain)

      apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
      prModel = app.get<typeof PersonalRepresentative>(
        getModelToken(PersonalRepresentative),
      )
      prRightsModel = app.get<typeof PersonalRepresentativeRight>(
        getModelToken(PersonalRepresentativeRight),
      )
      prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
        getModelToken(PersonalRepresentativeRightType),
      )
      prScopePermission = app.get<typeof PersonalRepresentativeScopePermission>(
        getModelToken(PersonalRepresentativeScopePermission),
      )
      apiScopeDelegationTypeModel = app.get<typeof ApiScopeDelegationType>(
        getModelToken(ApiScopeDelegationType),
      )
      prDelegationTypeModel = app.get<
        typeof PersonalRepresentativeDelegationTypeModel
      >(getModelToken(PersonalRepresentativeDelegationTypeModel))
      delegationTypeModel = app.get<typeof DelegationTypeModel>(
        getModelToken(DelegationTypeModel),
      )
      delegationProviderModel = app.get<typeof DelegationProviderModel>(
        getModelToken(DelegationProviderModel),
      )
      delegationScopesModel = app.get<typeof DelegationScope>(
        getModelToken(DelegationScope),
      )
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
      delegationDelegationTypeModelModel = app.get<
        typeof DelegationDelegationType
      >(getModelToken(DelegationDelegationType))
      nationalRegistryApi = app.get(NationalRegistryClientService)
      delegationIndexService = app.get(DelegationsIndexService)
      factory = new FixtureFactory(app)
    })

    const createDelegationTypeAndProvider = async (rightCode: string[]) => {
      const newDelegationProvider = await delegationProviderModel.create({
        id: AuthDelegationProvider.PersonalRepresentativeRegistry,
        name: 'Talsmannagrunnur',
        description: 'Talsmannagrunnur',
        delegationTypes: [],
      })

      await delegationTypeModel.bulkCreate(
        rightCode.map((code) => {
          return {
            id: getPersonalRepresentativeDelegationType(code),
            providerId: newDelegationProvider.id,
            name: getPersonalRepresentativeDelegationType(code),
            description: `Personal representative delegation type for right type ${code}`,
          }
        }),
      )
    }

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('when user calls GET /delegations/scopes with general mandate delegation type', () => {
      const representeeNationalId = getFakeNationalId()
      const scopeNames = [
        'api-scope/generalMandate1',
        'api-scope/generalMandate2',
        'api-scope/generalMandate3',
      ]

      beforeAll(async () => {
        const delegations = await delegationModel.create({
          id: uuid(),
          fromDisplayName: 'Test',
          fromNationalId: representeeNationalId,
          toNationalId: userNationalId,
          toName: 'Test',
        })

        await delegationProviderModel.create({
          id: AuthDelegationProvider.Custom,
          name: 'Custom',
          description: 'Custom',
        })

        await delegationTypeModel.create({
          id: AuthDelegationType.GeneralMandate,
          name: 'generalMandate',
          description: 'generalMandate',
          providerId: AuthDelegationProvider.Custom,
        })

        await delegationDelegationTypeModelModel.create({
          delegationId: delegations.id,
          delegationTypeId: AuthDelegationType.GeneralMandate,
        })

        await apiScopeModel.bulkCreate(
          scopeNames.map((name) => ({
            name,
            domainName: domain.name,
            enabled: true,
            description: `${name}: description`,
            displayName: `${name}: display name`,
          })),
        )

        // set 2 of 3 scopes to have general mandate delegation type
        await apiScopeDelegationTypeModel.bulkCreate([
          {
            apiScopeName: scopeNames[0],
            delegationType: AuthDelegationType.GeneralMandate,
          },
          {
            apiScopeName: scopeNames[1],
            delegationType: AuthDelegationType.GeneralMandate,
          },
        ])
      })

      afterAll(async () => {
        await delegationDelegationTypeModelModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await delegationModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await delegationTypeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await delegationProviderModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await apiScopeDelegationTypeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await apiScopeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
      })

      it('should should get all general mandate scopes', async () => {
        const response = await server.get('/delegations/scopes').query({
          fromNationalId: representeeNationalId,
          delegationType: [AuthDelegationType.GeneralMandate],
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual([scopeNames[0], scopeNames[1]])
      })

      it('should return all general mandate scopes and other preset scopes', async () => {
        const newDelegation = await delegationModel.create({
          id: uuid(),
          fromDisplayName: 'Test',
          fromNationalId: representeeNationalId,
          domainName: domain.name,
          toNationalId: userNationalId,
          toName: 'Test',
        })

        await delegationTypeModel.create({
          id: AuthDelegationType.Custom,
          name: 'custom',
          description: 'custom',
          providerId: AuthDelegationProvider.Custom,
        })

        await delegationScopesModel.create({
          id: uuid(),
          delegationId: newDelegation.id,
          scopeName: scopeNames[2],
          // set valid from as yesterday and valid to as tomorrow
          validFrom: addDays(new Date(), -1),
          validTo: addDays(new Date(), 1),
        })

        await apiScopeDelegationTypeModel.create({
          apiScopeName: scopeNames[2],
          delegationType: AuthDelegationType.Custom,
        })

        const response = await server.get('/delegations/scopes').query({
          fromNationalId: representeeNationalId,
          delegationType: [
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.Custom,
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.arrayContaining(scopeNames))
        expect(response.body).toHaveLength(scopeNames.length)
      })
    })

    describe('and given we have 3 valid, 1 not yet active and 1 outdate right types', () => {
      type rightsTypeStatus = 'valid' | 'unactivated' | 'outdated'
      type rightsType = [code: string, status: rightsTypeStatus]
      const rightsTypes: rightsType[] = [
        ['valid1', 'valid'],
        ['valid2', 'valid'],
        ['unactivated', 'unactivated'],
        ['outdated', 'outdated'],
      ]

      beforeAll(async () => {
        await prRightTypeModel.bulkCreate(
          rightsTypes.map(([code, status]) => {
            switch (status) {
              case 'valid':
                return getPersonalRepresentativeRightType(code)
              case 'unactivated':
                return getPersonalRepresentativeRightType(
                  code,
                  faker.date.soon(7),
                )
              case 'outdated':
                return getPersonalRepresentativeRightType(
                  code,
                  faker.date.recent(5),
                  faker.date.recent(),
                )
            }
          }),
        )
        await createDelegationTypeAndProvider(rightsTypes.map(([code]) => code))

        client.supportedDelegationTypes = delegationTypes
        await factory.createClient(client)
      })

      afterAll(async () => {
        await prRightTypeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await delegationTypeModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
        await delegationProviderModel.destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
      })

      describe.each([
        [1, 0, 0, 2, 1],
        [2, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 2],
        [1, 1, 1, 0, 0],
      ])(
        'and given user has %d active representees with valid rights, %d active representees with outdated rights and %d active representees with unactivated',
        (
          valid: number,
          outdated: number,
          unactivated: number,
          deceased: number,
          nationalRegistryErrors: number,
        ) => {
          let nationalRegistryApiSpy: jest.SpyInstance
          const validRepresentedPersons: NameIdTuple[] = []
          const outdatedRepresentedPersons: NameIdTuple[] = []
          const unactivatedRepresentedPersons: NameIdTuple[] = []
          const errorNationalIdsRepresentedPersons: NameIdTuple[] = []
          const deceasedNationalIds = times(deceased, getFakeNationalId)
          const errorNationalIds = times(
            nationalRegistryErrors,
            getFakeNationalId,
          )

          beforeAll(async () => {
            for (let i = 0; i < valid; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representedPerson[1],
              )
              validRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('valid1', relationship.id),
              )
              await prDelegationTypeModel.create({
                personalRepresentativeId: relationship.id,
                delegationTypeId:
                  getPersonalRepresentativeDelegationType('valid1'),
              })
            }

            for (let i = 0; i < outdated; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representedPerson[1],
              )
              outdatedRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('outdated', relationship.id),
              )
              await prDelegationTypeModel.create({
                personalRepresentativeId: relationship.id,
                delegationTypeId:
                  getPersonalRepresentativeDelegationType('outdated'),
              })
            }

            for (let i = 0; i < unactivated; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                getFakeNationalId(),
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representedPerson[1],
              )
              unactivatedRepresentedPersons.push(representedPerson)
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('unactivated', relationship.id),
              )
              await prDelegationTypeModel.create({
                personalRepresentativeId: relationship.id,
                delegationTypeId:
                  getPersonalRepresentativeDelegationType('unactivated'),
              })
            }

            for (let i = 0; i < deceased; i++) {
              const representedPerson: NameIdTuple = [
                getFakeName(),
                deceasedNationalIds[i],
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representedPerson[1],
              )

              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('valid1', relationship.id),
              )
              await prDelegationTypeModel.create({
                personalRepresentativeId: relationship.id,
                delegationTypeId:
                  getPersonalRepresentativeDelegationType('valid1'),
              })
            }

            for (let i = 0; i < nationalRegistryErrors; i++) {
              const representedPerson: NameIdTuple = [
                UNKNOWN_NAME,
                errorNationalIds[i],
              ]
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representedPerson[1],
              )

              errorNationalIdsRepresentedPersons.push(representedPerson)
              // Create Personal Representative model which will have nationalIdRepresentedPerson throw an error
              // when national registry api getIndividual is called
              await prModel.create(relationship)
              await prRightsModel.create(
                getPersonalRepresentativeRights('valid1', relationship.id),
              )
              await prDelegationTypeModel.create({
                personalRepresentativeId: relationship.id,
                delegationTypeId:
                  getPersonalRepresentativeDelegationType('valid1'),
              })
            }

            const nationalRegistryUsers = [
              ...validRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
              ...outdatedRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
              ...unactivatedRepresentedPersons.map(([name, nationalId]) =>
                createNationalRegistryUser({ name, nationalId }),
              ),
            ]

            nationalRegistryApiSpy = jest
              .spyOn(nationalRegistryApi, 'getIndividual')
              .mockImplementation(async (id) => {
                if (deceasedNationalIds.includes(id)) {
                  return null
                }

                if (
                  errorNationalIds.find(
                    (errorNationalId) => id === errorNationalId,
                  )
                ) {
                  throw new Error('National registry error')
                }

                const user = nationalRegistryUsers.find(
                  (u) =>
                    u?.nationalId === id &&
                    // Make sure we don't return a user that has been marked as deceased
                    !deceasedNationalIds.includes(u?.nationalId),
                )

                return user ?? null
              })
          })

          afterAll(async () => {
            jest.clearAllMocks()
            await prRightsModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
            await prModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
            await prDelegationTypeModel.destroy({
              where: {},
              cascade: true,
              truncate: true,
              force: true,
            })
          })

          describe('when user calls GET /v2/delegations', () => {
            const path = '/v2/delegations'
            let response: request.Response
            let body: MergedDelegationDTO[]

            beforeAll(async () => {
              response = await server.get(path)
              body = response.body
            })

            it('should have a an OK return status', () => {
              expect(response.status).toEqual(200)
            })

            it(`should return ${valid} ${
              valid === 1 ? 'item' : 'items'
            } `, () => {
              expect(body).toHaveLength(valid + nationalRegistryErrors)
            })

            it('should have the nationalId of the user as the representer', () => {
              expect(
                body.every((d) => d.toNationalId === userNationalId),
              ).toBeTruthy()
            })

            it('should only have the nationalId of the valid representees', () => {
              expect(body.map((d) => d.fromNationalId).sort()).toEqual(
                [
                  ...validRepresentedPersons.map(([_, id]) => id),
                  ...errorNationalIdsRepresentedPersons.map(([_, id]) => id),
                ].sort(),
              )
            })

            it(`should only have ${
              valid + nationalRegistryErrors === 1 ? 'name' : 'names'
            } of the valid represented ${
              valid + nationalRegistryErrors === 1 ? 'person' : 'persons'
            }`, () => {
              expect(body.map((d) => d.fromName).sort()).toEqual([
                ...validRepresentedPersons.map(([name, _]) => name).sort(),
                ...errorNationalIdsRepresentedPersons.map(([name]) => name),
              ])
            })

            it(`should have fetched the ${
              valid + deceased + nationalRegistryErrors === 1 ? 'name' : 'names'
            }  of the valid represented ${
              valid + deceased + nationalRegistryErrors === 1
                ? 'person'
                : 'persons'
            } from nationalRegistryApi`, () => {
              expect(nationalRegistryApiSpy).toHaveBeenCalledTimes(
                valid + deceased + nationalRegistryErrors,
              )
            })

            it('should have the delegation type claims of PersonalRepresentative', () => {
              expect(
                body.every(
                  (d) =>
                    d.types[0] === AuthDelegationType.PersonalRepresentative,
                ),
              ).toBeTruthy()
            })

            it('should have made prModels inactive for deceased persons', async () => {
              // Arrange
              const expectedModels = await prModel.findAll({
                where: {
                  nationalIdRepresentedPerson: deceasedNationalIds,
                  inactive: true,
                  inactiveReason: InactiveReason.DECEASED_PARTY,
                },
              })

              // Assert
              expect(expectedModels.length).toEqual(deceased)

              expectedModels.forEach((model) => {
                expect(model.inactive).toEqual(true)
                expect(model.inactiveReason).toEqual(
                  InactiveReason.DECEASED_PARTY,
                )
              })
            })

            it('should return delegation if national registry api getIndividual throws an error', async () => {
              // Arrange
              const expectedModels = await prModel.findAll({
                where: {
                  nationalIdRepresentedPerson: errorNationalIds,
                },
              })

              // Assert
              expect(expectedModels.length).toEqual(errorNationalIds.length)
            })

            it('should index delegations', () => {
              expect(delegationIndexService.indexDelegations).toHaveBeenCalled()
            })
          })
        },
      )

      describe('and given we have a combination of scopes for personal representative', () => {
        type scopesType = [name: string, enabled: boolean, rightTypes: string[]]
        const scopes: scopesType[] = [
          [scopeValid1, true, ['valid1']],
          [scopeValid2, true, ['valid2']],
          [scopeValid1and2, true, ['valid1', 'valid2']],
          [scopeUnactiveType, true, ['unactivated']],
          [scopeOutdated, true, ['outdated']],
          [disabledScope, false, ['valid1']],
        ]

        beforeAll(async () => {
          const apiScopes = scopes.flatMap(([name, enabled, types]) => ({
            name: name,
            enabled,
            domainName: domain.name,
            supportedDelegationTypes: types.map((rt) =>
              getPersonalRepresentativeDelegationType(rt),
            ),
          }))

          await Promise.all(
            apiScopes.map((scope) => factory.createApiScope(scope)),
          )

          await prScopePermission.bulkCreate(
            scopes.flatMap(([name, _, types]) =>
              types.map((rt) => getScopePermission(rt, name)),
            ),
          )
        })

        afterAll(async () => {
          await prScopePermission.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await apiScopeDelegationTypeModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
          await apiScopeModel.destroy({
            where: {},
            cascade: true,
            truncate: true,
            force: true,
          })
        })

        describe.each([
          [['valid1'], [scopeValid1, scopeValid1and2]],
          [['valid2'], [scopeValid2, scopeValid1and2]],
          [
            ['valid1', 'valid2'],
            [scopeValid1, scopeValid2, scopeValid1and2],
          ],
          [[], []],
          // [['unactivated'], []],
          // [['outdated'], []],
        ])(
          'and given user is representing persons with rights %p',
          (rights, expected) => {
            const representeeNationalId = getFakeNationalId()

            beforeAll(async () => {
              const relationship = getPersonalRepresentativeRelationship(
                userNationalId,
                representeeNationalId,
              )

              await prModel.create(relationship)
              await prRightsModel.bulkCreate(
                rights.map((r) =>
                  getPersonalRepresentativeRights(r, relationship.id),
                ),
              )
              await prDelegationTypeModel.bulkCreate(
                rights.map((r) => ({
                  personalRepresentativeId: relationship.id,
                  delegationTypeId: getPersonalRepresentativeDelegationType(r),
                })),
              )
            })

            afterAll(async () => {
              await prRightsModel.destroy({
                where: {},
                cascade: true,
                truncate: true,
                force: true,
              })
              await prModel.destroy({
                where: {},
                cascade: true,
                truncate: true,
                force: true,
              })
              await prDelegationTypeModel.destroy({
                where: {},
                cascade: true,
                truncate: true,
                force: true,
              })
            })

            describe('when user calls GET /delegations/scopes', () => {
              const path = '/delegations/scopes'
              let response: request.Response
              let body: string[]

              beforeAll(async () => {
                response = await server.get(`${path}`).query({
                  fromNationalId: representeeNationalId,
                  delegationType: rights.map((r) =>
                    getPersonalRepresentativeDelegationType(r),
                  ),
                })
                body = response.body
              })

              it('should have a an OK return status', () => {
                expect(response.status).toEqual(200)
              })

              it(`should return ${
                expected.length === 0 ? 'no scopes' : JSON.stringify(expected)
              }`, () => {
                expect(body.sort()).toEqual(expected.sort())
              })
            })
          },
        )
      })
    })
  })
})
