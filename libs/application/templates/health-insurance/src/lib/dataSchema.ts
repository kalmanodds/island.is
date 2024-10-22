import { applicantInformationSchema } from '@island.is/application/ui-forms'
import * as z from 'zod'
import { EmploymentStatus, YES, YesOrNo } from '../utils/constants'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const formerInsurance = z.object({
  registration: z.nativeEnum(YesOrNo),
  country: z.string().min(1),
  personalId: z.string().min(1),
  institution: z.string().min(1),
  confirmationOfResidencyDocument: FileSchema.optional(),
  entitlement: z.nativeEnum(YesOrNo).optional(),
  entitlementReason: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema(),
  status: z.object({ type: z.nativeEnum(EmploymentStatus) }),
  children: z.nativeEnum(YesOrNo),
  citizenship: z.string().optional(),
  formerInsurance,
  hasAdditionalInfo: z.nativeEnum(YesOrNo),
  additionalRemarks: z.string().optional(),
  additionalFiles: z.array(FileSchema).optional(),
  confirmCorrectInfo: z.array(z.enum([YES])).length(1),
})
