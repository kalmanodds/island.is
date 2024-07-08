import { getSlugFromType } from '@island.is/application/core'
import { SendMailOptions } from 'nodemailer'

import { EmailTemplateGeneratorProps } from '../../../../types'
import {
  DistrictCommissionerLogo,
  fontStyles,
  ulStyles,
  liStyles,
} from './consts'
import { Address, Attachment } from 'nodemailer/lib/mailer'

interface ApplicationSubmittedEmail {
  (
    props: EmailTemplateGeneratorProps,
    fileContent: Attachment['content'],
    recipientEmail: Address['address'],
    syslumennName: string,
    caseNumber?: string,
  ): SendMailOptions
}

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  fileContent,
  recipientEmail,
  syslumennName,
  caseNumber,
) => {
  const {
    application,
    options: { clientLocationOrigin, email },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`

  const fileName =
    'Samningur um breytt lögheimili barna og meðlag' +
    (caseNumber ? ` nr. ${caseNumber}` : '')
  const caseNumberString = caseNumber
    ? `<li style=${liStyles}><strong>${syslumennName}</strong> hefur nú móttekið erindið sem fékk málsnúmerið <strong>${caseNumber}</strong>. Hægt er að vísa í það í frekari samskiptum við fulltrúa sýslumanns.</li>`
    : ''
  const subject = 'Samningur um breytt lögheimili barns og meðlag'
  const body = `
        <img src=${DistrictCommissionerLogo} height="78" width="246" />


        <h1 style="margin-bottom: 0;">${subject} undirritaður af báðum foreldrum</h1>
        <p style="${fontStyles} margin: 20px 0;">Báðir foreldrar hafa undirritað samning um breytt lögheimili og meðlag. Í viðhengi er afrit af undirrituðum samning.</p>
        <strong style="${fontStyles} display: block; margin-bottom: 8px;">Næstu skref </strong><ul style="${ulStyles}"><li style=${liStyles}>Umsóknin fer nú í afgreiðslu hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband. Afgreiðsla sýslumans getur tekið tvær vikur.</li><li style=${liStyles}>Ef sýslumaður samþykkir breytinguna fáið þið staðfestingu senda í rafræn skjöl á Island.is. Sýslumaður mun síðan tilkynna Þjóðskrá Íslands um lögheimilisbreytingu ef við á.</li><li style=${liStyles}>Í samningnum er samið um einfalt meðlag sem rennur til nýs lögheimilisforeldris. Foreldrar sem semja um aukið meðlag þurfa að gera um það sérstakan samning og leita staðfestingar sýslumanns. Til að meðlag fari í innheimtu þarf nýtt lögheimilisforeldri að skila staðfestingu sýslumanns rafrænt til Tryggingastofnunar.</li>${caseNumberString}</ul>

        <a style="${fontStyles}" href=${applicationLink} target="_blank">Opna umsókn</a>.
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: recipientEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
    attachments: [
      {
        filename: `${fileName}.pdf`,
        content: fileContent,
        encoding: 'binary',
      },
    ],
  }
}
