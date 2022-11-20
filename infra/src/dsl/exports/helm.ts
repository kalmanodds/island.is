import { Kubernetes } from '../kubernetes-runtime'
import { dumpServiceHelm } from '../file-formats/yaml'
import {
  getHelmValueFile,
  Mocks,
} from '../value-files-generators/helm-value-file'
import { EnvironmentConfig } from '../types/charts'
import { renderers } from '../upstream-dependencies'
import { prepareServicesForEnv, renderer } from '../processing/service-sets'
import { generateJobsForFeature } from '../output-generators/feature-jobs'
import { ServiceBuilder } from '../dsl'
import { hacks } from './hacks'

export const renderHelmValueFileContent = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
) => {
  return dumpServiceHelm(
    env,
    await renderHelmServiceFile(env, habitat, services, withMocks),
  )
}

export const renderHelmServiceFile = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
  withMocks: Mocks,
) => {
  const { services: renderedServices, runtime } = await renderHelmServices(
    env,
    habitat,
    services,
  )
  return getHelmValueFile(runtime, renderedServices, withMocks, env)
}
export const renderHelmServices = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  services: ServiceBuilder<any>[],
) => {
  let runtime = new Kubernetes(env)
  hacks(services, habitat)
  return {
    services: await renderer({
      runtime: runtime,
      services: services,
      outputFormat: renderers.helm,
      env: env,
    }),
    runtime: runtime,
  }
}

export const renderHelmJobForFeature = async (
  env: EnvironmentConfig,
  habitat: ServiceBuilder<any>[],
  image: string,
  services: ServiceBuilder<any>[],
) => {
  const result = prepareServicesForEnv({
    services: services,
    env: env,
    outputFormat: renderers.helm,
  })
  return generateJobsForFeature(image, result, env)
}
