import PDFDocument from 'pdfkit'
import { MessageDescriptor } from '@formatjs/intl'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  getWordByGender,
  lowercase,
  Word,
} from '@island.is/judicial-system/formatters'
import { Gender, SubpoenaType } from '@island.is/judicial-system/types'

import { nowFactory } from '../factories/date.factory'
import { subpoena as strings } from '../messages'
import { Case } from '../modules/case'
import { Defendant } from '../modules/defendant'
import { Subpoena } from '../modules/subpoena'
import {
  addConfirmation,
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addMediumText,
  addNormalRightAlignedText,
  addNormalText,
  Confirmation,
  setTitle,
} from './pdfHelpers'

const getIntro = (
  gender?: Gender,
): {
  intro: MessageDescriptor
  absenceIntro: MessageDescriptor
  arrestIntro: MessageDescriptor
} => {
  switch (gender) {
    case Gender.MALE:
      return {
        intro: strings.intro,
        absenceIntro: strings.absenceIntro,
        arrestIntro: strings.arrestIntro,
      }

    case Gender.FEMALE:
      return {
        intro: strings.intro_female,
        absenceIntro: strings.absenceIntroFemale,
        arrestIntro: strings.arrestIntroFemale,
      }
    default:
      return {
        intro: strings.intro_non_binary,
        absenceIntro: strings.absenceIntroNonBinary,
        arrestIntro: strings.arrestIntroNonBinary,
      }
  }
}

export const createSubpoena = (
  theCase: Case,
  defendant: Defendant,
  formatMessage: FormatMessage,
  subpoena?: Subpoena,
  arraignmentDate?: Date,
  location?: string,
  subpoenaType?: SubpoenaType,
  confirmation?: Confirmation,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  const sinc: Buffer[] = []
  const intro = getIntro(defendant.gender)

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))

  if (confirmation) {
    addEmptyLines(doc, 5)
  }

  addNormalText(doc, `${theCase.court?.name}`, 'Times-Bold', true)

  addNormalRightAlignedText(
    doc,
    `${formatDate(new Date(subpoena?.created ?? nowFactory()), 'PPP')}`,
    'Times-Roman',
  )

  arraignmentDate = arraignmentDate ?? subpoena?.arraignmentDate
  location = location ?? subpoena?.location
  subpoenaType = subpoenaType ?? defendant.subpoenaType

  if (theCase.court?.name) {
    addNormalText(
      doc,
      theCase.court.address || 'Ekki skráð', // the latter shouldn't happen, if it does we have an problem with the court data
      'Times-Roman',
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    defendant.name
      ? `${defendant.name}, ${formatDOB(
          defendant.nationalId,
          defendant.noNationalId,
        )}`
      : 'Nafn ekki skráð',
  )
  addNormalText(doc, defendant.address || 'Heimili ekki skráð')
  addEmptyLines(doc)
  addHugeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, `Mál nr. ${theCase.courtCaseNumber}`, 'Times-Bold')
  addEmptyLines(doc)
  addNormalText(doc, 'Ákærandi: ', 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor?.institution
      ? theCase.prosecutor.institution.name
      : 'Ekki skráður',
    'Times-Roman',
  )
  addNormalText(
    doc,
    theCase.prosecutor
      ? `                     (${theCase.prosecutor.name} ${lowercase(
          theCase.prosecutor.title,
        )})`
      : 'Ekki skráður',
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    `${capitalize(getWordByGender(Word.AKAERDI, defendant.gender))}: `,
    'Times-Bold',
    true,
  )
  addNormalText(doc, defendant.name || 'Nafn ekki skráð', 'Times-Roman')
  addEmptyLines(doc, 2)

  if (arraignmentDate) {
    addNormalText(
      doc,
      formatMessage(strings.arraignmentDate, {
        arraignmentDate: formatDate(new Date(arraignmentDate), 'PPPp'),
      }),
      'Times-Bold',
    )
  }

  if (location) {
    addNormalText(
      doc,
      formatMessage(strings.courtRoom, {
        courtRoom: location,
      }),
      'Times-Roman',
    )
  }

  addNormalText(doc, formatMessage(strings.type), 'Times-Roman')
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(intro.intro), 'Times-Bold')

  if (subpoenaType) {
    addNormalText(
      doc,
      formatMessage(
        subpoenaType === SubpoenaType.ABSENCE
          ? intro.absenceIntro
          : intro.arrestIntro,
      ),
      'Times-Bold',
    )
  }

  addEmptyLines(doc)
  addNormalText(doc, formatMessage(strings.deadline), 'Times-Roman')

  addFooter(doc)

  if (confirmation) {
    addConfirmation(doc, confirmation)
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
