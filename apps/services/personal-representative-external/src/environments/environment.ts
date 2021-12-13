const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative-external',
  },
  auth: {
    audience: '@island.is',
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative-external',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative-external',
  },
  auth: {
    audience: '@island.is',
    issuer: process.env.IDS_ISSUER ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
