import { defineConfig } from '@island.is/nest/config'

export const backendModuleConfig = defineConfig({
  name: 'BackendModule',
  load: (env) => ({
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
    secretToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
  }),
})
