import type { AuthConfig } from '@island.is/auth-nest-tools'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'
import { AuditOptions } from '@island.is/nest/audit'

export interface Environment<
  TemplateAPISubset extends keyof TemplateAPIConfig = keyof TemplateAPIConfig,
> {
  production: boolean
  environment: string
  name: string
  baseApiUrl: string
  audit: AuditOptions
  auth: AuthConfig
  templateApi: Pick<TemplateAPIConfig, TemplateAPISubset>
  contentful: {
    accessToken: string
  }
}
