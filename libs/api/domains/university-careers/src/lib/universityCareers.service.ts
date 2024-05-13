import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import {
  StudentTrackDto,
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { CmsContentfulService } from '@island.is/cms'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { mapToStudent, mapToStudentTrackModel } from './mapper'
import { StudentTrack } from './models/studentTrack.model'
import { StudentTrackHistory } from './models/studentTrackHistory.model'
import { StudentTrackTranscriptError } from './models/studentTrackTranscriptError.model'
import { StudentTrackTranscriptResult } from './models/studentTrackTranscriptResult.model'
import { UniversityContentfulReferenceIds } from './universityCareers.types'
import { UniversityIdMap } from '@island.is/clients/university-careers'

const LOG_CATEGORY = 'university-careers-api'
const FEATURE_FLAGS: Record<Exclude<UniversityId, 'hi'>, Features> = {
  unak: Features.isUniversityOfAkureyriEnabled,
  lbhi: Features.isAgriculturalUniversityOfIcelandEnabled,
  bifrost: Features.isBifrostUniversityEnabled,
  holar: Features.isHolarUniversityEnabled,
}

@Injectable()
export class UniversityCareersService {
  constructor(
    private universityCareers: UniversityCareersClientService,
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getContentfulOrganizations = async (locale: Locale) => {
    const universityIds = Object.values(UniversityId)
    const referenceIds = universityIds.map(
      (id) => UniversityContentfulReferenceIds[id],
    )

    //Get all organizations now -> fewer contentful calls
    return this.cmsContentfulService.getOrganizations({
      lang: locale,
      referenceIdentifiers: referenceIds,
    })
  }

  async getStudentTrackHistory(
    user: User,
    locale: Locale,
  ): Promise<StudentTrackHistory | null> {
    let normalizedResults: Array<typeof StudentTrackTranscriptResult> = []

    //parallel execution
    await Promise.all(
      Object.values(UniversityId).map(async (uni) => {
        const data = await this.getStudentTrackHistoryByUniversity(
          user,
          uni,
          locale,
        )

        if (!data) {
          this.logger.debug('No data found')
          return
        }

        if (Array.isArray(data)) {
          normalizedResults = normalizedResults.concat(data)
        } else {
          normalizedResults.push(data)
        }
      }),
    )

    return {
      trackResults: normalizedResults,
    }
  }

  async getStudentTrackHistoryByUniversity(
    user: User,
    university: UniversityId,
    locale: Locale,
  ): Promise<Array<StudentTrackDto> | StudentTrackTranscriptError | null> {
    if (university !== 'hi') {
      const isUniversityAllowed = await this.featureFlagService.getValue(
        FEATURE_FLAGS[university],
        false,
        user,
      )
      if (!isUniversityAllowed) {
        return null
      }
    }
    const data: Array<StudentTrackDto> | StudentTrackTranscriptError | null =
      await this.universityCareers
        .getStudentTrackHistory(user, university, locale)
        .catch((e: Error | FetchError) => {
          return { university, error: JSON.stringify(e) }
        })

    if (Array.isArray(data)) {
      return data.map((d) => mapToStudent(d)).filter(isDefined)
    }

    return data
  }

  async getStudentTrack(
    user: User,
    university: UniversityId,
    trackNumber: number,
    locale: Locale,
  ): Promise<StudentTrack | null> {
    const data = await this.universityCareers.getStudentTrack(
      user,
      trackNumber,
      university,
      locale,
    )

    if (!data?.transcript) {
      this.logger.debug('No transcript data found', {
        category: LOG_CATEGORY,
        university,
      })
      return null
    }
    return (
      mapToStudentTrackModel(data, {
        id: university,
        shortId: UniversityIdMap[university],
      }) ?? null
    )
  }
}
