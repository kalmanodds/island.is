import { GenericContainer, Wait } from 'testcontainers'

export default async () => {
  const lc = await new GenericContainer(
    `${process.env.DOCKER_REGISTRY ?? ''}localstack/localstack:0.11.1`,
  )
    .withEnv('SERVICES', 'sqs')
    .withExposedPorts(4566)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).__localstack__ = lc

  process.env.SQS_ENDPOINT = `http://${lc.getHost()}:${lc.getMappedPort(4566)}`
}
