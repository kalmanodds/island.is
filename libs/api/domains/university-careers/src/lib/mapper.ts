import {
  StudentTrackDto,
  StudentTrackOverviewDto,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { StudentTrack } from './models/studentTrack.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'

export const mapToStudent = (
  data: StudentTrackDto,
): StudentTrackTranscript | null => {
  if (
    !data ||
    !data?.name ||
    !data?.graduationDate ||
    !data?.trackNumber ||
    !data?.school ||
    !data?.faculty ||
    !data?.studyProgram ||
    !data?.degree
  ) {
    return null
  }

  return {
    name: data.name,
    trackNumber: data.trackNumber,
    school: data.school,
    faculty: data.faculty,
    studyProgram: data.studyProgram,
    degree: data.degree,
    graduationDate: data.graduationDate.toISOString(),
    institution: data?.institution?.id
      ? {
          id: data?.institution?.id,
          shortId: data.institution?.idShort,
          displayName: data.institution?.displayName,
        }
      : undefined,
  }
}

export const mapToStudentTrackModel = (
  data: StudentTrackOverviewDto,
): Omit<StudentTrack, 'organizationReferenceId'> | null => {
  if (
    !data?.transcript ||
    !data?.body?.description ||
    !data?.body?.footer ||
    !data?.body?.unconfirmedData
  ) {
    return null
  }

  const transcript = mapToStudent(data.transcript)

  if (!transcript) {
    return null
  }

  return {
    transcript,
    files:
      data.files
        ?.map((d) => {
          if (!d.type || !d.locale || !d.displayName || !d.fileName) {
            return null
          }

          return {
            type: d.type,
            locale: d.locale,
            displayName: d.displayName,
            fileName: d.fileName,
          }
        })
        .filter(isDefined) ?? [],
    metadata: {
      description: data?.body?.description,
      footer: data?.body?.footer,
      unconfirmedData: data?.body?.unconfirmedData,
    },
  }
}
