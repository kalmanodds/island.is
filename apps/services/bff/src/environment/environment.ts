import { BffEnvironment, environmentSchema } from './environment.schema'

export const isProduction = process.env.NODE_ENV === 'production'

const parsedEnvironment = environmentSchema.parse({
  production: isProduction,
  port: process.env.PORT,
  keyPath: process.env.BFF_CLIENT_KEY_PATH,
})

export const environment: BffEnvironment = parsedEnvironment
