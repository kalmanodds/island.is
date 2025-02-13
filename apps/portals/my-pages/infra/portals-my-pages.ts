import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (services: {
  graphql: ServiceBuilder<'api'>
}): ServiceBuilder<'service-portal'> =>
  service('service-portal')
    .namespace('service-portal')
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .resources({
      limits: { cpu: '300m', memory: '256Mi' },
      requests: { cpu: '5m', memory: '32Mi' },
    })
    .env({
      BASEPATH: '/minarsidur',
      SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      SI_PUBLIC_ENVIRONMENT: ref((h) => h.env.type),
      SI_PUBLIC_GRAPHQL_API: {
        prod: '/api/graphql',
        staging: '/api/graphql',
        dev: '/api/graphql',
        local: ref((h) => `http://${h.svc(services.graphql)}/api/graphql`),
      },
    })
    .secrets({
      SI_PUBLIC_CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
      SI_PUBLIC_DD_RUM_APPLICATION_ID: '/k8s/DD_RUM_APPLICATION_ID',
      SI_PUBLIC_DD_RUM_CLIENT_TOKEN: '/k8s/DD_RUM_CLIENT_TOKEN',
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
        paths: ['/minarsidur'],
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'nginx-ingress-external',
      'islandis',
      'user-notification',
      'identity-server',
    )
