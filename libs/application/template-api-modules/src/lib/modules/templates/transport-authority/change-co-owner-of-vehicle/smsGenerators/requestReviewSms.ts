import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { getApplicationPruneDateStr } from '../change-co-owner-of-vehicle.utils'
import { ApplicationConfigurations } from '@island.is/application/types'

export type RequestReviewSms = (
  application: Application,
  options: {
    clientLocationOrigin: string
  },
  recipient: EmailRecipient,
) => SmsMessage

export const generateRequestReviewSms: RequestReviewSms = (
  application,
  options,
  recipient,
) => {
  const { clientLocationOrigin } = options

  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const pruneDateStr = getApplicationPruneDateStr(application.created)

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Þín bíður ósamþykkt beiðni um breytingu á meðeigendum fyrir ökutækið ${permno} inn á island.is/umsoknir. ` +
      `Til þess að breytingin verði skráð þarftu að samþykkja beiðnina fyrir ${pruneDateStr}.` +
      `Slóð á umsóknina: ${clientLocationOrigin}/${ApplicationConfigurations.ChangeCoOwnerOfVehicle.slug}/${application.id}.`,
  }
}
