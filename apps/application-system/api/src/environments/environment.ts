import { Environment } from './environment.interface'

const devConfig = {
  production: false,
  environment: 'local',
  name: 'local',
  baseApiUrl: 'http://localhost:4444',
  redis: {
    urls: (
      process.env.REDIS_NODES ??
      'localhost:7000,localhost:7001,localhost:7002,localhost:7003,localhost:7004,localhost:7005'
    ).split(','),
  },
  audit: {
    defaultNamespace: '@island.is/applications',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  templateApi: {
    clientLocationOrigin: 'http://localhost:4242/umsoknir',
    emailOptions: {
      useTestAccount: true,
      useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
    },
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: 'http://localhost:4444',
    syslumenn: {
      url: 'https://api.syslumenn.is/dev',
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: 'https://smsapi.devnova.is',
      username: 'IslandIs_User_Development',
      password: process.env.NOVA_PASSWORD,
    },
    drivingLicense: {
      clientConfig: {
        secret: process.env.XROAD_DRIVING_LICENSE_SECRET,
        xroadClientId: 'IS-DEV/GOV/10000/island-is-client',
        xroadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
        xroadPathV1:
          'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
        xroadPathV2:
          'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2',
      },
    },
    criminalRecord: {
      clientConfig: {
        secret: process.env.XROAD_CRIMINAL_RECORD_SECRET,
        xroadClientId: 'TODO',//'IS-DEV/GOV/10000/island-is-client',
        xroadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
        xroadPath: 'TODO',//'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
      },
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    paymentOptions: {
      arkBaseUrl: process.env.ARK_BASE_URL,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
      xRoadClientId:
        process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
      xRoadProviderId:
        process.env.XROAD_PAYMENT_PROVIDER_ID ?? 'IS-DEV/GOV/10021/FJS-Public',
      callbackAdditionUrl:
        process.env.XROAD_PAYMENT_ADDITION_CALLBACK_URL ?? '/',
      callbackBaseUrl:
        process.env.XROAD_PAYMENT_BASE_CALLBACK_URL ??
        'https://localhost:3333/applications/',
      username: process.env.XROAD_PAYMENT_USER,
      password: process.env.XROAD_PAYMENT_PASSWORD,
    },
    partyLetter: {
      partyLetterRegistryApiBasePath: 'http://localhost:4251',
      endorsementsApiBasePath: 'http://localhost:4246',
      defaultClosedDate: new Date(
        process.env.PARTY_ENDORSEMENTLISTS_DEFAULT_CLOSED_DATE ||
          '2021-09-15T00:00:00.000Z',
      ),
    },
    generalPetition: {
      endorsementsApiBasePath: 'http://localhost:4246',
    },
    partyApplication: {
      defaultClosedDate: new Date(
        process.env.PARTY_ENDORSEMENTLISTS_DEFAULT_CLOSED_DATE ||
          '2021-09-15T00:00:00.000Z',
      ),
      endorsementsApiBasePath: 'http://localhost:4246',
      options: {
        adminEmails: {
          partyApplicationRvkSouth: 's@kogk.is',
          partyApplicationRvkNorth: 's@kogk.is',
          partyApplicationSouthWest: 's@kogk.is',
          partyApplicationNorthWest: 's@kogk.is',
          partyApplicationNorth: 's@kogk.is',
          partyApplicationSouth: 's@kogk.is',
        },
      },
    },
    healthInsuranceV2: {
      xRoadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8080',
      xRoadProviderId:
        process.env.XROAD_HEALTH_INSURANCE_ID ??
        'IS-DEV/GOV/10007/SJUKRA-Protected',
      xRoadClientId:
        process.env.XROAD_CLIENT_ID ?? 'IS-DEV/GOV/10000/island-is-client',
      username: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME ?? '',
      password: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD ?? '',
    },
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  name: process.env.name,
  baseApiUrl: process.env.GRAPHQL_API_URL,
  redis: {
    urls: (process.env.REDIS_NODES ?? process.env.REDIS_URL_NODE_01)?.split(
      ',',
    ),
  },
  audit: {
    defaultNamespace: '@island.is/applications',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'application-system-api',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
  templateApi: {
    clientLocationOrigin: process.env.CLIENT_LOCATION_ORIGIN,
    emailOptions: {
      useTestAccount: false,
      useNodemailerApp: false,
      options: {
        region: process.env.EMAIL_REGION,
      },
    },
    email: {
      sender: process.env.EMAIL_FROM_NAME,
      address: process.env.EMAIL_FROM,
    },
    jwtSecret: process.env.AUTH_JWT_SECRET,
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    baseApiUrl: process.env.GRAPHQL_API_URL,
    syslumenn: {
      url: process.env.SYSLUMENN_HOST,
      username: process.env.SYSLUMENN_USERNAME,
      password: process.env.SYSLUMENN_PASSWORD,
    },
    smsOptions: {
      url: process.env.NOVA_URL,
      username: process.env.NOVA_USERNAME,
      password: process.env.NOVA_PASSWORD,
    },
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    drivingLicense: {
      clientConfig: {
        secret: process.env.XROAD_DRIVING_LICENSE_SECRET,
        xroadClientId: process.env.XROAD_CLIENT_ID,
        xroadBaseUrl: process.env.XROAD_BASE_PATH,
        xroadPathV1: process.env.XROAD_DRIVING_LICENSE_PATH,
        xroadPathV2: process.env.XROAD_DRIVING_LICENSE_V2_PATH,
      },
    },
    criminalRecord: {
      clientConfig: {
        secret: process.env.XROAD_CRIMINAL_RECORD_SECRET,
        xroadClientId: process.env.XROAD_CLIENT_ID,
        xroadBaseUrl: process.env.XROAD_BASE_PATH,
        xroadPath: process.env.XROAD_CRIMINAL_RECORD_PATH,
      },
    },
    paymentOptions: {
      arkBaseUrl: process.env.ARK_BASE_URL,
      xRoadBaseUrl: process.env.XROAD_BASE_PATH,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      xRoadProviderId: process.env.XROAD_PAYMENT_PROVIDER_ID,
      callbackAdditionUrl: process.env.XROAD_PAYMENT_ADDITION_CALLBACK_URL,
      callbackBaseUrl: process.env.XROAD_PAYMENT_BASE_CALLBACK_URL,
      username: process.env.XROAD_PAYMENT_USER,
      password: process.env.XROAD_PAYMENT_PASSWORD,
    },
    partyLetter: {
      partyLetterRegistryApiBasePath:
        process.env.PARTY_LETTER_REGISTRY_API_BASE_PATH,
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
      defaultClosedDate: new Date(
        process.env.PARTY_ENDORSEMENTLISTS_DEFAULT_CLOSED_DATE ||
          '2021-09-15T00:00:00.000Z',
      ),
    },
    generalPetition: {
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
    },
    partyApplication: {
      defaultClosedDate: new Date(
        process.env.PARTY_ENDORSEMENTLISTS_DEFAULT_CLOSED_DATE ||
          '2021-09-15T00:00:00.000Z',
      ),
      endorsementsApiBasePath: process.env.ENDORSEMENTS_API_BASE_PATH,
      options: {
        adminEmails: {
          partyApplicationRvkSouth:
            process.env.PARTY_APPLICATION_RVK_SOUTH_ADMIN_EMAIL,
          partyApplicationRvkNorth:
            process.env.PARTY_APPLICATION_RVK_NORTH_ADMIN_EMAIL,
          partyApplicationSouthWest:
            process.env.PARTY_APPLICATION_SOUTH_WEST_ADMIN_EMAIL,
          partyApplicationNorthWest:
            process.env.PARTY_APPLICATION_NORTH_WEST_ADMIN_EMAIL,
          partyApplicationNorth:
            process.env.PARTY_APPLICATION_NORTH_ADMIN_EMAIL,
          partyApplicationSouth:
            process.env.PARTY_APPLICATION_SOUTH_ADMIN_EMAIL,
        },
      },
    },
    healthInsuranceV2: {
      xRoadBaseUrl: process.env.XROAD_BASE_PATH,
      xRoadProviderId: process.env.XROAD_HEALTH_INSURANCE_ID,
      xRoadClientId: process.env.XROAD_CLIENT_ID,
      username: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME,
      password: process.env.XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD,
    },
  },
  application: {
    attachmentBucket: process.env.APPLICATION_ATTACHMENT_BUCKET,
    presignBucket: process.env.FILE_SERVICE_PRESIGN_BUCKET,
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  contentful: {
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
} as Environment

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
