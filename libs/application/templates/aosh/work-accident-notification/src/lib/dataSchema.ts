import { z } from 'zod'
import * as kennitala from 'kennitala'

// const TimeRefine = z.object({
//   from: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
//     params: error.invalidValue,
//   }),
//   to: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
//     params: error.invalidValue,
//   }),
// })

// const OpeningHoursRefine = z.object({
//   weekdays: TimeRefine,
//   weekends: TimeRefine,
// })

// const Time = z.object({
//   from: z.string().optional(),
//   to: z.string().optional(),
// })

const option = z.object({
  value: z.string(),
  label: z.string(),
})

const accidentSchema = z.object({
  accidentLocation: option,
  accidentLocationParentGroup: option.optional(),
  date: z.string(), // Validate a date string
  didAoshCome: z.string(), // Boolean ?
  didPoliceCome: z.string(),
  exactLocation: z.string(),
  how: z.string(),
  municipality: z.string(),
  time: z.string(), // Need to use time refiner here, see commented code above
  wasDoing: z.string(),
  wentWrong: z.string(),
})

const companySchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  address: z.string().optional(),
  addressOfBranch: z.string().optional(),
  name: z.string().optional(),
  nameOfBranch: z.string().optional(),
  numberOfEmployees: z.string(),
  postnumber: z.string().optional(),
  postnumberOfBranch: z.string().optional(),
})

const employeeSchema = z.object({
  // TODO A lot of this optional stuff is to ease developement, go over what is and isn't required
  victimsOccupation: option.optional(),
  victimsOccupationMajor: option.optional().nullish(),
  victimsOccupationSubMajor: option.optional().nullish(),
  victimsOccupationMinor: option.optional().nullish(),
  victimsOccupationUnit: option.optional().nullish(),
  address: z.string(),
  dateOfAccident: z.string(), // date string, need to validate here or is the prebuilt date component enough ?
  employmentStatus: z.string(),
  employmentTime: z.string(),
  //nationalField: TODO .... name and nationalId
  nationality: z.string(),
  postnumberAndMunicipality: z.string(),
  startDate: z.string(), // date string
  tempEmploymentSSN: z.string(), // Starfsmannaleiga
  workstation: z.string(), // starfsstöð
})

// Reusable schema generator
const createCauseAndEffectSchema = (
  fieldKey: string,
  mostSeriousKey: string,
) => {
  return z
    .object({
      [fieldKey]: z
        .record(z.array(option))
        .refine((obj) => Object.values(obj).some((arr) => arr.length > 0), {
          message: 'At least one option has to be chosen',
        }),
      [mostSeriousKey]: z.string().optional(),
    })
    .refine(
      (data) => {
        // Narrow the type of data[fieldKey]
        const fieldData = data[fieldKey] as
          | Record<string, { value: string; label: string }[]>
          | undefined

        // Safely check if fieldData exists
        if (!fieldData) return false

        // Get total number of option objects across all arrays
        const totalOptions = Object.values(fieldData).reduce(
          (sum, arr) => sum + arr.length,
          0,
        )

        // If there are 2 or more options, the most serious must have a value
        return totalOptions < 2 || (totalOptions >= 2 && data[mostSeriousKey])
      },
      {
        message:
          'If more than one option is chosen, you must specify the most serious one',
        path: [mostSeriousKey], // Error path
      },
    )
}

const circumstancesSchema = createCauseAndEffectSchema(
  'physicalActivities',
  'physicalActivitiesMostSerious',
)

const workDeviationsSchema = createCauseAndEffectSchema(
  'workDeviations',
  'workDeviationsMostSerious',
)

const contactModeOfInjurySchema = createCauseAndEffectSchema(
  'contactModeOfInjury',
  'contactModeOfInjuryMostSerious',
)

const absenceSchema = z.object({
  absenceDueToAccident: z.string(),
})

const companyLaborProtectionSchema = z.object({
  workhealthAndSafetyOccupation: z.array(z.string()).optional(),
})

const projectPurchaseSchema = z.object({
  nationalId: z
    .string()
    .optional()
    .refine(
      (nationalId) =>
        !nationalId || (nationalId.length > 0 && kennitala.isValid(nationalId)),
      {
        message: 'Invalid nationalId',
      },
    ),
  name: z.string().optional(),
})

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v), // TODO ?
  companyInformation: companySchema,
  companyLaborProtection: companyLaborProtectionSchema,
  accident: accidentSchema,
  absence: absenceSchema,
  employee: employeeSchema,
  projectPurchase: projectPurchaseSchema,
  circumstances: circumstancesSchema,
  deviations: workDeviationsSchema,
  causeOfInjury: contactModeOfInjurySchema,
})

export type WorkAccidentNotification = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
