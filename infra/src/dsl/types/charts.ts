import { FeatureNames } from '../features'
import {
  OpsEnv,
  Service,
  ServiceDefinition,
  ServiceDefinitionCore,
  ServiceDefinitionForEnv,
} from './input-types'
import { ServiceBuilder } from '../dsl'

export interface DeploymentRuntime {
  env: EnvironmentConfig
  deps: { [name: string]: Set<string> }

  ref(from: ServiceDefinitionCore, to: Service | string): string
}

export interface EnvironmentConfig {
  auroraHost: string
  auroraReplica?: string
  domain: string
  releaseName: string
  defaultMaxReplicas: number
  defaultMinReplicas: number
  type: OpsEnv
  featuresOn: FeatureNames[]
  awsAccountRegion: 'eu-west-1' | 'us-east-1'
  awsAccountId: string
  feature?: string
  global: any
}

export type OpsEnvName =
  | 'dev01'
  | 'devIds'
  | 'staging01'
  | 'stagingIds'
  | 'prod'
  | 'prod-ids'

export type EnvironmentServices = { [name in OpsEnv]: ServiceBuilder<any>[] }

export type EnvironmentConfigs = { [name in OpsEnvName]: EnvironmentConfig }
