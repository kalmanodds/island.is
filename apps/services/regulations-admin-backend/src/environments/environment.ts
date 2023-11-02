export default {
  production: process.env.NODE_ENV === 'production',
  audit: {
    defaultNamespace: '@island.is/services/regulations-admin-backend',
    groupName: process.env.AUDIT_GROUP_NAME,
    // Same service name as in Nx project.json
    serviceName: 'regulations-admin-backend',
  },
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: '@admin.island.is',
  },
}
