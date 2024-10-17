import { ConfigType } from '@island.is/nest/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpStatus, INestApplication } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { setupTestServer } from '../../../../test/setupTestServer'
import { BffConfig } from '../../bff.config'
import { IdsService } from '../ids/ids.service'
import {
  GetLoginSearchParamsReturnValue,
  ParResponse,
  TokenResponse,
} from '../ids/ids.types'

const SID_VALUE = 'fake_uuid'
const SESSION_COOKIE_NAME = 'sid'
const KID = 'test-kid'
const ALGORITM_TYPE = 'HS256'
const SECRET_KEY = 'mock_secret'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fake_uuid'),
}))

const validSigningKey = {
  kid: KID,
  alg: ALGORITM_TYPE,
  getPublicKey: jest.fn().mockReturnValue(SECRET_KEY),
}

const noMatchKidSigningKey = {
  kid: 'invalid-kid',
  alg: ALGORITM_TYPE,
  getPublicKey: jest.fn().mockReturnValue(SECRET_KEY),
}

const mockedSigningKeys = jest.fn().mockReturnValue([validSigningKey])

jest.mock('jwks-rsa', () => {
  return jest.fn().mockImplementation(() => ({
    getSigningKeys: mockedSigningKeys,
  }))
})

const mockCacheStore = new Map()

const mockCacheManagerValue = {
  set: jest.fn((key, value) => mockCacheStore.set(key, value)),
  get: jest.fn((key) => mockCacheStore.get(key)),
  del: jest.fn((key) => mockCacheStore.delete(key)),
}

const parResponse: ParResponse = {
  request_uri: 'urn:ietf:params:oauth:request_uri:abc123',
  expires_in: 600,
}

const tokensResponse: TokenResponse = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.mockSignature',
  id_token: jwt.sign(
    {
      iss: 'https://example.com',
      sub: '1234567890',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      sid: SID_VALUE,
    },
    'mockSecret',
    { algorithm: ALGORITM_TYPE },
  ),
  refresh_token: 'mockRefreshToken1234567890',
  scope: 'openid profile email',
  token_type: 'Bearer',
  expires_in: 3600,
}

const allowedTargetLinkUri = 'http://test-client.com/testclient'

const mockIdsService = {
  getPar: jest.fn().mockResolvedValue({
    type: 'success',
    data: parResponse,
  }),
  getTokens: jest.fn().mockResolvedValue({
    type: 'success',
    data: tokensResponse,
  }),
  revokeToken: jest.fn().mockResolvedValue({
    type: 'success',
  }),
  getLoginSearchParams: jest.fn().mockImplementation(
    (args: {
      sid: string
      codeChallenge: string
      loginHint?: string
      prompt?: string
    }): GetLoginSearchParamsReturnValue => ({
      client_id: '@test_client_id',
      redirect_uri: 'http://localhost:3010/testclient/bff/callbacks/login',
      response_type: 'code',
      response_mode: 'query',
      scope: 'test_scope offline_access openid profile',
      state: SID_VALUE,
      code_challenge: 'test_code_challenge',
      code_challenge_method: 'test_code_challenge_method',
      ...(args.loginHint && { login_hint: args.loginHint }),
      ...(args.prompt && { prompt: args.prompt }),
    }),
  ),
}

describe('AuthController', () => {
  let app: INestApplication
  let server: request.SuperTest<request.Test>
  let mockConfig: ConfigType<typeof BffConfig>
  let baseUrlWithKey: string

  beforeAll(async () => {
    const app = await setupTestServer({
      override: (builder) =>
        builder
          .overrideProvider(CACHE_MANAGER)
          .useValue(mockCacheManagerValue)
          .overrideProvider(IdsService)
          .useValue(mockIdsService),
    })

    mockConfig = app.get<ConfigType<typeof BffConfig>>(BffConfig.KEY)
    baseUrlWithKey = `${mockConfig.clientBaseUrl}${process.env.BFF_CLIENT_KEY_PATH}`

    server = request(app.getHttpServer())
  })

  afterEach(() => {
    mockCacheStore.clear()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('GET /login', () => {
    it('should cache the login attempt', async () => {
      // Arrange
      const setSpy = jest.spyOn(mockCacheManagerValue, 'set')

      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(setSpy).toHaveBeenCalled()

      const [key, value] = setSpy.mock.calls[0]

      expect(key).toEqual(`attempt_${SID_VALUE}`)
      expect(value).toMatchObject({
        originUrl: baseUrlWithKey,
        codeVerifier: expect.any(String),
        targetLinkUri: allowedTargetLinkUri,
      })
    })

    it('should call login endpoint with correct parameters', async () => {
      // Arrange
      const expectedParams = {
        client_id: mockConfig.ids.clientId,
        response_type: 'code',
        response_mode: 'query',
        scope: 'test_scope offline_access openid profile',
        redirect_uri: mockConfig.callbacksRedirectUris.login,
        code_challenge_method: 'test_code_challenge_method',
      }

      const unknownValueParams = ['state', 'code_challenge']

      // Act
      const res = await server.get('/login')

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)

      // Check if the location header starts with the issuer ID
      expect(res.headers.location).toMatch(
        new RegExp(`^${mockConfig.ids.issuer}?`),
      )

      const url = new URL(res.headers.location)

      // Verify that each expected parameter is present
      for (const [key, value] of Object.entries(expectedParams)) {
        if (key === 'scope') {
          for (const scope of value.split(' ')) {
            expect(url.searchParams.get('scope')).toContain(scope)
          }
        } else {
          expect(url.searchParams.get(key)).toEqual(value)
        }
      }

      // Verify that each unknown value parameter is present
      for (const key of unknownValueParams) {
        expect(url.searchParams.get(key)).toBeDefined()
      }
    })

    it('should validate the query string param "target_link_uri" if not allowed', async () => {
      // Arrange
      const invalidTargetLinkUri = 'http://test-client.com/invalid'

      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Login failed!',
      })

      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: invalidTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should validate the query string param "target_link_uri" if allowed', async () => {
      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(
        new RegExp(`^${mockConfig.ids.issuer}?`),
      )
    })

    it('should support PAR (Pushed Authorization Request) when enabled in config', async () => {
      // Arrange
      const parResponse: ParResponse = {
        request_uri: 'urn:ietf:params:oauth:request_uri:abc123',
        expires_in: 600,
      }

      const expectedParams = {
        request_uri: parResponse.request_uri,
        client_id: mockConfig.ids.clientId,
      }

      const redirectUrlSearchParams = new URLSearchParams(expectedParams)

      const app = await setupTestServer({
        override: (builder) =>
          builder
            .overrideProvider(IdsService)
            .useValue(mockIdsService)
            .overrideProvider(BffConfig.KEY)
            .useValue({
              ...mockConfig,
              parSupportEnabled: true,
            }),
      })

      const newServer = request(app.getHttpServer())
      const getParSpy = jest.spyOn(mockIdsService, 'getPar')

      // Act
      const res = await newServer.get('/login')

      // Assert
      expect(getParSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toEqual(
        `${
          mockConfig.ids.issuer
        }/connect/authorize?${redirectUrlSearchParams.toString()}`,
      )
    })
  })

  describe('GET /callbacks/login', () => {
    it('should redirect with error if invalid_request is present', async () => {
      // Arrange
      const idsError = 'Invalid request'
      const searchParams = new URLSearchParams({
        bff_error_code: '500',
        bff_error_description: idsError,
      })

      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server.get('/callbacks/login').query({
        invalid_request: idsError,
      })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should validate query string params and redirect with error if invalid', async () => {
      // Arrange
      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Login failed!',
      })
      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server.get('/callbacks/login')

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    const scenarios = [
      {
        description:
          'should successfully finish callback login and redirect to fallback originUrl',
        targetLinkUri: undefined,
        expectedLocation: 'http://test-client.com/testclient',
      },
      {
        description:
          'should successfully finish callback login and redirect to target_link_uri query param',
        targetLinkUri: allowedTargetLinkUri,
        expectedLocation: allowedTargetLinkUri,
      },
    ]

    it.each(scenarios)(
      '$description',
      async ({ targetLinkUri, expectedLocation }) => {
        // Arrange
        const code = 'testcode'
        const getTokensSpy = jest.spyOn(mockIdsService, 'getTokens')
        const deleteCacheSpy = jest.spyOn(mockCacheManagerValue, 'del')
        const setCacheSpy = jest.spyOn(mockCacheManagerValue, 'set')
        const getCacheSpy = jest.spyOn(mockCacheManagerValue, 'get')

        // Act - First request to cache the login attempt
        await server
          .get('/login')
          .query(targetLinkUri ? { target_link_uri: targetLinkUri } : {})

        const loginAttempt = setCacheSpy.mock.calls[0]

        // Assert - First request should cache the login attempt
        expect(setCacheSpy.mock.calls[0]).toContain(`attempt_${SID_VALUE}`)
        expect(loginAttempt[1]).toMatchObject({
          originUrl: baseUrlWithKey,
          codeVerifier: expect.any(String),
          targetLinkUri,
        })

        // Then make a callback to the login endpoint
        const res = await server
          .get('/callbacks/login')
          .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
          .query({ code, state: SID_VALUE })

        const currentLogin = setCacheSpy.mock.calls[1]

        // Assert
        expect(setCacheSpy).toHaveBeenCalled()

        expect(currentLogin[0]).toContain(`current_${SID_VALUE}`)
        // Check if the cache contains the correct values for the current login
        expect(currentLogin[1]).toMatchObject(tokensResponse)

        expect(getCacheSpy).toHaveBeenCalled()
        expect(getTokensSpy).toHaveBeenCalled()
        expect(deleteCacheSpy).toHaveBeenCalled()

        expect(res.status).toEqual(HttpStatus.FOUND)

        // Should redirect to the expected location
        expect(res.headers.location).toEqual(expectedLocation)
      },
    )
  })

  describe('GET /logout', () => {
    it('should throw bad request if no sid query string is found', async () => {
      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })
      const res = await server.get('/logout')

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('should validate if no session cookie is found', async () => {
      // Act
      const res = await server.get('/logout').query({ sid: SID_VALUE })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toEqual(mockConfig.logoutRedirectUri)
    })

    it('should redirect to logout redirect uri with error params if cookie and session state do not match', async () => {
      // Arrange
      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Logout failed!',
      })

      const errorUrl = `${allowedTargetLinkUri}?${searchParams.toString()}`

      // Act
      const res = await server
        .get('/logout')
        .query({ sid: SID_VALUE })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=invalid_uuid`])

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should successfully logout and redirect to logout redirect uri', async () => {
      // Arrange
      const deleteCacheSpy = jest.spyOn(mockCacheManagerValue, 'del')
      const revokeRefreshTokenSpy = jest.spyOn(mockIdsService, 'revokeToken')
      const searchParams = new URLSearchParams({
        id_token_hint: tokensResponse.id_token,
        post_logout_redirect_uri: mockConfig.logoutRedirectUri,
      })

      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .get('/logout')
        .query({ sid: SID_VALUE })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(revokeRefreshTokenSpy).toHaveBeenCalled()
      expect(deleteCacheSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.FOUND)

      expect(res.headers.location).toEqual(
        `${
          mockConfig.ids.issuer
        }/connect/endsession?${searchParams.toString()}`,
      )
    })
  })

  describe('POST /callbacks/logout', () => {
    let tokenPayload: object

    beforeAll(() => {
      tokenPayload = {
        iss: mockConfig.ids.issuer,
        sub: '1234567890',
        exp: Math.floor(Date.now() / 1000) + 3600,
        sid: SID_VALUE,
      }
    })

    it('should throw 400 if logout_token is missing from body', async () => {
      // Act
      const res = await await server.post('/callbacks/logout')

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
      // Expect error to be
      expect(res.body).toMatchObject({
        statusCode: 400,
        message: 'No param "logout_token" provided!',
      })
    })

    it('should throw an error for a invalid logout_token, no matching key found for kid', async () => {
      // Arrange
      mockedSigningKeys.mockImplementationOnce(() => [noMatchKidSigningKey])

      const invalidToken = jwt.sign(tokenPayload, SECRET_KEY, {
        algorithm: ALGORITM_TYPE,
        header: { kid: KID },
      })

      // Act
      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: invalidToken })

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should throw an error for a invalid logout_token, no sid in the token', async () => {
      // Arrange
      const invalidToken = jwt.sign(
        {
          ...tokenPayload,
          sid: undefined,
        },
        SECRET_KEY,
        {
          algorithm: ALGORITM_TYPE,
          header: { kid: KID },
        },
      )

      // Act
      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: invalidToken })

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should return a 200 success response', async () => {
      // Arrange
      const validToken = jwt.sign(tokenPayload, SECRET_KEY, {
        algorithm: ALGORITM_TYPE,
        header: { kid: KID },
      })

      const getCacheSpy = jest.spyOn(mockCacheManagerValue, 'get')
      const revokeRefreshTokenSpy = jest.spyOn(mockIdsService, 'revokeToken')

      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: validToken })

      // Assert
      expect(getCacheSpy).toHaveBeenCalled()
      expect(revokeRefreshTokenSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toMatchObject({
        status: 'success',
        message: 'Logout successful!',
      })
    })
  })
})
