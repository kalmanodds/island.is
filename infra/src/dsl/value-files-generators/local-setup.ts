import {
  LocalrunService,
  LocalrunValueFile,
  Services,
} from '../types/output-types'
import { Localhost } from '../localhost-runtime'
import { shouldIncludeEnv } from '../../cli/render-env-vars'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { globSync } from 'glob'
import { join } from 'path'
import { rootDir } from '../consts'
import { logger } from '../../common'

const mapServiceToNXname = async (serviceName: string) => {
  const projectRootPath = join(__dirname, '..', '..', '..', '..')
  const projects = globSync(['apps/*/project.json', 'apps/*/*/project.json'], {
    cwd: projectRootPath,
  })
  const nxName = (
    await Promise.all(
      projects.map(async (path) => {
        const project: {
          name: string
          targets: { [name: string]: any }
        } = JSON.parse(
          await readFile(join(projectRootPath, path), {
            encoding: 'utf-8',
          }),
        )
        return typeof project.targets[`service-${serviceName}`] !== 'undefined'
          ? project.name
          : null
      }),
    )
  ).filter((name) => name !== null) as string[]

  if (nxName.length > 1)
    throw new Error(
      `More then one NX projects found with service name ${serviceName} - ${nxName.join(
        ',',
      )}`,
    )
  return nxName.length === 1 ? nxName[0] : serviceName
}

/**
 * This function `getLocalrunValueFile` is an asynchronous function that takes in a `runtime` object
 * and a `services` object. It returns a promise that resolves to a `LocalrunValueFile` object.
 *
 * The function processes the `services` and `runtime` objects to create configurations for Docker
 * and mock services. These configurations are then written to specific files in the root directory,
 * of the form `.env.${service-name}`.
 *
 * @param {Localhost} runtime - The runtime object.
 * @param {Services<LocalrunService>} services - The services object.
 * @returns {Promise<LocalrunValueFile>}
 */
export const getLocalrunValueFile = async (
  runtime: Localhost,
  services: Services<LocalrunService>,
  { dryRun = false, noWrite = false } = {},
): Promise<LocalrunValueFile> => {
  logger.debug('getLocalrunValueFile', { runtime, services })

  logger.debug('Process services', { services })
  const dockerComposeServices = {} as Services<LocalrunService>
  for (const [name, service] of Object.entries(services)) {
    const portConfig = runtime.ports[name]
      ? { PORT: runtime.ports[name].toString() }
      : {}
    const serviceNXName = await mapServiceToNXname(name)
    logger.debug('Process service', { name, service, serviceNXName })
    dockerComposeServices[name] = {
      env: Object.assign(
        {},
        Object.entries(service.env)
          .filter(shouldIncludeEnv)
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
        { PROD_MODE: 'true' },
        portConfig,
      ) as Record<string, string>,
      commands: [
        `cd "${rootDir}"`,
        `. ./.env.${serviceNXName}`, // `source` is bashism
        `echo "Starting ${name} in $PWD"`,
        `yarn nx serve ${serviceNXName}`,
      ],
    }
  }

  const firstService = Object.keys(dockerComposeServices)[0]
  logger.debug('Dump all env values to files', {
    dockerComposeServices,
    [`${firstService}.env`]: dockerComposeServices[firstService]?.env,
  })
  await Promise.all(
    Object.entries(dockerComposeServices).map(
      async ([name, svc]: [string, LocalrunService]) => {
        const serviceNXName = await mapServiceToNXname(name)
        logger.debug(`Writing env to file for ${name}`, { name, serviceNXName })
        if (dryRun) return
        await writeFile(
          join(rootDir, `.env.${serviceNXName}`),
          Object.entries(svc.env)
            .filter(([name, value]) => shouldIncludeEnv(name) && !!value)
            .map(([name, value]) => {
              // Basic shell sanitation
              const escapedValue = value
                .replace(/'/g, "'\\''")
                .replace(/[\n\r]/g, '')
              const localizedValue = escapedValue
              //   .replace(
              //   /^(https?:\/\/)[^/]+(?=$|\/)/g,
              //   '$1localhost',
              // )
              const exportedKeyValue = `export ${name}='${localizedValue}'`
              logger.debug('Env rewrite debug', {
                escapedValue,
                localizedValue,
                exportedKeyValue,
              })

              return exportedKeyValue
            })
            .join('\n'),
          { encoding: 'utf-8' },
        )
      },
    ),
  )
  const mocksConfigs = Object.entries(runtime.mocks).reduce(
    (acc, [name, target]) => {
      return {
        ports: [...acc.ports, runtime.ports[name]],
        configs: [
          ...acc.configs,
          {
            protocol: 'http',
            name: name,
            port: runtime.ports[name],
            stubs: [
              {
                predicates: [{ equals: {} }],
                responses: [
                  {
                    proxy: {
                      to: target.replace('localhost', 'host.docker.internal'),
                      mode: 'proxyAlways',
                      // soffia proxy service hack. need to get this proxy to forward host header
                      // but not really how to do it yet.
                      ...(target === 'https://localhost:8443'
                        ? {
                            injectHeaders: {
                              Host: 'soffiaprufa.skra.is',
                            },
                          }
                        : {}),
                      predicateGenerators: [
                        {
                          matches: {
                            method: true,
                            path: true,
                            query: true,
                            body: true,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      }
    },
    { ports: [] as number[], configs: [] as any[] },
  )
  const defaultMountebankConfigDir = `${rootDir}/dist`
  const defaultMountebankConfig = `${defaultMountebankConfigDir}/mountebank-imposter-config.json`
  logger.debug('Writing default mountebank config to file', {
    defaultMountebankConfig,
    mocksConfigs,
  })
  if (!dryRun && noWrite) {
    await mkdir(defaultMountebankConfigDir, { recursive: true })
    await writeFile(
      defaultMountebankConfig,
      JSON.stringify({ imposters: mocksConfigs.configs }),
      { encoding: 'utf-8' },
    )
  }

  const mocksObj = {
    containerer: 'docker',
    containererCommand: 'run',
    containererFlags: '-it --rm',
    ports: ['2525', ...mocksConfigs.ports],
    mounts: [`${defaultMountebankConfig}:/app/default.json:z`],
    image: 'docker.io/bbyars/mountebank:2.8.1',
    command: 'start --configfile=/app/default.json',
  }

  const mocks = [
    mocksObj.containerer,
    mocksObj.containererCommand,
    `--name ${mocksObj.image.split(':')[0].split('/').pop()}`,
    mocksObj.containererFlags,
    mocksObj.ports.map((p) => `-p ${p}:${p}`).join(' '),
    mocksObj.mounts.map((m) => `-v ${m}`).join(' '),
    mocksObj.image,
    mocksObj.command,
  ]
  const mocksStr = mocks.join(' ')
  logger.debug(`Docker command for mocks:`, { mocks })

  const renderedServices: Services<LocalrunService> = {}
  logger.debug('Debugging dockerComposeServices', {
    dockerComposeServices,
  })
  for (const [name, service] of Object.entries(dockerComposeServices)) {
    renderedServices[name] = { commands: service.commands, env: service.env }
    logger.debug(`Docker command for ${name}:`, { command: service.commands })
  }
  return {
    services: renderedServices,
    mocks: mocksStr,
  }
}
