import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { YES, NO, MarriageTermination } from './constants'
import { coreErrorMessages } from '@island.is/application/core/messages'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const individualInfo = z.object({
  person: z.object({
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    name: z.string().refine((v) => v),
  }),
  phone: z.string().refine((v) => isValidPhoneNumber(v)),
  email: z.string().refine((v) => isValidEmail(v)),
})

const personalInfo = z.object({
  address: z.string().refine((v) => v),
  citizenship: z.string(),
  maritalStatus: z.string(),
  previousMarriageTermination: z
    .enum([
      MarriageTermination.divorce,
      MarriageTermination.lostSpouse,
      MarriageTermination.annulment,
    ])
    .optional(),
})

export const dataSchema = z.object({
  //applicant's part of the application
  approveExternalData: z.boolean().refine((v) => v),
  applicant: individualInfo,
  spouse: individualInfo,
  witness1: individualInfo,
  witness2: individualInfo,
  personalInfo: personalInfo,
  spousePersonalInfo: personalInfo,
  ceremony: z
    .object({
      hasDate: z.string().refine((v) => v),
      date: z.string(),
      ceremonyPlace: z.string(),
      office: z.string().optional(),
      society: z.string().optional(),
    })
    .partial()
    .refine(({ hasDate }) => !!hasDate, {
      message: coreErrorMessages.defaultError.defaultMessage,
      path: ['hasDate'],
    })
    .refine(
      ({ hasDate, ceremonyPlace }) =>
        (hasDate === YES && !!ceremonyPlace) || hasDate === NO || !hasDate,
      {
        message: coreErrorMessages.defaultError.defaultMessage,
        path: ['ceremonyPlace'],
      },
    )
    .refine(
      ({ hasDate, date }) =>
        (hasDate === YES && !!date) || hasDate === NO || !hasDate,
      {
        message: coreErrorMessages.defaultError.defaultMessage,
        path: ['date'],
      },
    ),

  //spouse's part of the application
  spouseApprove: z.array(z.enum([YES, NO])).nonempty(),
  spouseApproveExternalData: z.boolean().refine((v) => v),
})
