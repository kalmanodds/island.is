import { defineMessages } from 'react-intl'

export const specialProvisions = {
  subsection: defineMessages({
    name: {
      id: 'ra.application:specialProvisions.subSection.name',
      defaultMessage: 'Sérákvæði',
      description: 'Special provisions sub section name',
    },
    pageTitle: {
      id: 'ra.application:specialProvisions.subSection.pageTitle',
      defaultMessage: 'Nánari lýsing og sérákvæði',
      description: 'Special provisions page title',
    },
    pageDescription: {
      id: 'ra.application:specialProvisions.subSection.pageDescription',
      defaultMessage:
        'Hér má taka fram hvað fylgir húsnæðinu, hvort húsreglur séu til staðar eða önnur ákvæði sem fylgja samningnum. Athugið að þau ákvæði sem eru andstætt húsaleigulögum munu ekki hafa gildi í túlkun leigusamningsins. [Sjá nánar hér](https://www.althingi.is/lagas/nuna/1994036.html).',
      description: 'Special provisions page description',
    },
  }),

  housingInfo: defineMessages({
    title: {
      id: 'ra.application:specialProvisions.housingInfo.title',
      defaultMessage: 'Lýsing á húsnæðinu og því sem með fylgir  ',
      description: 'Special provisions housing description title',
    },
    tooltip: {
      id: 'ra.application:specialProvisions.housingInfo.tooltip',
      defaultMessage:
        'Fylgja húsgögn? Ertu að leigja hluta af húsnæðinu? Annað sem skiptir máli?',
      description: 'Special provisions housing description title tooltip',
    },
    inputLabel: {
      id: 'ra.application:specialProvisions.housingInfo.inputLabel',
      defaultMessage: 'Lýsing á húsnæði',
      description: 'Special provisions housing description input',
    },
    inputPlaceholder: {
      id: 'ra.application:specialProvisions.housingInfo.inputPlaceholder',
      defaultMessage: 'Skrifaðu hér lýsingu á húsnæðinu ',
      description: 'Special provisions housing description input placeholder',
    },
  }),

  housingRules: defineMessages({
    title: {
      id: 'ra.application:specialProvisions.housingRules.title',
      defaultMessage: 'Sérákvæði eða húsreglur  ',
      description: 'Special provisions housing rules title',
    },
    tooltip: {
      id: 'ra.application:specialProvisions.housingRules.tooltip',
      defaultMessage:
        'Eru einhvern önnur ákvæði sem eiga að vera í samningnum og eru í samræmi við húsaleigulög? T.d. eru gæludýr leyfð? Reykingar? Sérreglur um umgengni húsnæðisins?',
      description: 'Special provisions housing rules title tooltip',
    },
    inputLabel: {
      id: 'ra.application:specialProvisions.housingRules.inputLabel',
      defaultMessage: 'Sérákvæði',
      description: 'Special provisions housing rules input',
    },
    inputPlaceholder: {
      id: 'ra.application:specialProvisions.housingRules.inputPlaceholder',
      defaultMessage: 'Skrifaðu hér allt sem á við',
      description: 'Special provisions housing rules input placeholder',
    },
  }),
}
