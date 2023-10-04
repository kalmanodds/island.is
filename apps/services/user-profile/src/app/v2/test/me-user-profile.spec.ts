import { getRequestMethod, TestEndpointOptions } from '@island.is/testing/nest'
import request from 'supertest'
import { setupWithAuth, setupWithoutAuth } from './setup'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { FixtureFactory } from './fixtureFactory'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}
describe('MeUserProfile', () => {
  describe('Auth and scopes', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me/user-profile'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange

        const app = await setupWithoutAuth()

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me/user-profile'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithAuth({
          user: createCurrentUser(),
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me/user-profile'}
    `(
      '$method $endpoint should return 204 NoContentException when user has the correct scope but no user profile exists',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithAuth({
          user: createCurrentUser({
            scope: [UserProfileScope.read],
          }),
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(204)

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me/user-profile'}
    `(
      '$method $endpoint should return 200 with UserProfileDto for logged in user',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithAuth({
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: testUserProfile.email,
          emailStatus: DataStatus.NOT_DEFINED,
          emailVerified: false,
          mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_DEFINED,
        })

        await app.cleanUp()
      },
    )
  })
})
