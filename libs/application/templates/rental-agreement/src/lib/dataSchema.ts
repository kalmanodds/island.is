import { useLocale } from '@island.is/localization'
import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from './messages'
import { rentOtherFeesPayeeOptions } from './constants'

const { formatMessage } = useLocale()

const meterStatusRegex = /^[0-9]{1,10}(,[0-9]{1})?$/
const isValidMeterStatus = (value: string) => meterStatusRegex.test(value)

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((x) => x),
  applicant: z.object({
    nationalId: z.string().refine((x) => (x ? kennitala.isValid(x) : false), {
      params: m.dataSchema.nationalId,
    }),
  }),
  asdf: z.array(FileSchema),
  rentOtherFees: z.object({
    electricityCost: z.enum([
      rentOtherFeesPayeeOptions.TENANT,
      rentOtherFeesPayeeOptions.LANDLORD,
    ]),
    heatingCost: z.enum([
      rentOtherFeesPayeeOptions.TENANT,
      rentOtherFeesPayeeOptions.LANDLORD,
    ]),
    electricityCostMeterStatus: z.string().optional(),
    heatingCostMeterStatus: z.string().optional(),
  }),
})
