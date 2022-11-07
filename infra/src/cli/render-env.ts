import { OpsEnv } from '../dsl/types/input-types'
import { Envs } from '../environments'
import { ChartName, Charts, Deployments } from '../uber-charts/all-charts'
import {
  renderDockerValueFileContent,
  renderHelmValueFileContent,
} from '../dsl/exports/exports'
import { toServices } from '../dsl/exports/to-services'

// export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
//   return renderHelmValueFileContent(
//     Envs[Deployments[chartName][env]],
//     toServices(Charts[chartName][env]),
//   )
// }
export const renderEnv = async (env: OpsEnv, chartName: ChartName) => {
  return renderDockerValueFileContent(
    Envs[Deployments[chartName][env]],
    toServices(Charts[chartName][env]),
  )
}
