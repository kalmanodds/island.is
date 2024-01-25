import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { ElasticService } from '@island.is/content-search-toolkit'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
  FeaturedSupportQNAsResolver,
  PowerBiSliceResolver,
  LatestEventsSliceResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoLoader } from './loaders/organizationLogo.loader'
import { OrganizationLogoByReferenceIdLoader } from './loaders/organizationLogoByKey.loader'
import { OrganizationTitleByReferenceIdLoader } from './loaders/organizationTitleByKey.loader'
import { PowerBiService } from './powerbi.service'
import { PowerBiConfig } from './powerbi.config'

@Module({
  imports: [HttpModule, TerminusModule, PowerBiConfig.registerOptional()],
  providers: [
    CmsResolver,
    ArticleResolver,
    ElasticService,
    CmsContentfulService,
    CmsElasticsearchService,
    ContentfulRepository,
    CmsHealthIndicator,
    LatestNewsSliceResolver,
    FeaturedArticlesResolver,
    FeaturedSupportQNAsResolver,
    OrganizationLogoLoader,
    OrganizationLogoByReferenceIdLoader,
    OrganizationTitleByReferenceIdLoader,
    PowerBiService,
    PowerBiSliceResolver,
    LatestEventsSliceResolver,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoLoader,
    OrganizationLogoByReferenceIdLoader,
    OrganizationTitleByReferenceIdLoader,
    CmsElasticsearchService,
  ],
})
export class CmsModule {}
