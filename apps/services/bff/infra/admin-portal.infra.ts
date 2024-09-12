import { adminPortalScopes } from '@island.is/auth/scopes'
import {
  json,
  service,
  ServiceBuilder,
  ref,
} from '../../../../infra/src/dsl/dsl'

const generateWebBaseUrls = (path = '') => {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  return {
    dev: `https://beta.dev01.devland.is${path}`,
    staging: `https://beta.staging01.devland.is${path}`,
    prod: `https://island.is${path}`,
  }
}

export const serviceSetup = (services: {
  servicesBffAdminPortal: ServiceBuilder<'services-bff-admin-portal'>
  regulationsAdminBackend: ServiceBuilder<'regulations-admin-backend'>
}): ServiceBuilder<'services-bff-admin-portal'> =>
  service('services-bff-admin-portal')
    .namespace('services-bff')
    .image('services-bff')
    .redis()
    .env({
      // Idenity server
      IDENTITY_SERVER_CLIENT_ID: '@admin.island.is/bff',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_CLIENT_SCOPES: json(adminPortalScopes),
      // BFF
      BFF_CALLBACKS_BASE_PATH: generateWebBaseUrls('/stjornbord/bff/callbacks'),
      BFF_LOGOUT_REDIRECT_PATH: generateWebBaseUrls(),
      BFF_PROXY_API_ENDPOINT: generateWebBaseUrls('/api/graphql'),
      BFF_API_URL_PREFIX: 'stjornbord/bff',
      BFF_ALLOWED_EXTERNAL_API_URLS: json([
        ref((h) => `http://${h.svc(services.regulationsAdminBackend)}`),
      ]),
    })
    .secrets({
      // The secret should be a valid 32-byte base64 key.
      // Generate key example: `openssl rand -base64 32`
      BFF_TOKEN_SECRET_BASE64: '/k8s/services-bff/BFF_TOKEN_SECRET_BASE64',
    })
    .readiness('/health/check')
    .liveness('/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
