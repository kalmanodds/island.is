import { defineMessages } from 'react-intl'

export const incomeForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.incomeForm.general.sectionTitle',
      defaultMessage: 'Tekjur',
      description: 'Income form section Title',
    },
    pageTitle: {
      id: 'fa.application:section.incomeForm.general.pageTitle',
      defaultMessage: 'Hefur þú fengið tekjur í þessum eða síðustu tvo mánuði?',
      description: 'Income form page title',
    },
  }),
  bulletList: defineMessages({
    headline: {
      id: 'fa.application:section.incomeForm.bulletList.headline',
      defaultMessage: 'Dæmi um tekjur',
      description: 'Income form bullet list of examples of income headline',
    },
  }),
  examplesOfIncome: defineMessages({
    incomeExampleList: {
      id: 'fa.application:section.incomeForm.examplesOfIncome.incomeExampleList#markdown',
      defaultMessage:
        '* Greiðslur frá atvinnurekanda \n* Greiðslur frá Vinnumálastofnun \n* Greiðslur frá Tryggingastofnun \n* Greiðslur frá fæðingarorlofssjóði \n* Greiðslur frá Sjúkratryggingum Íslands  \n* Styrkir frá lífeyrissjóðum',
      description: 'Income form bullet list of examples of income',
    },
  }),
  summary: defineMessages({
    yes: {
      id: 'fa.application:section.incomeForm.summary.yes',
      defaultMessage: 'Ég hef fengið tekjur í þessum eða síðustu tvo mánuði',
      description:
        'Answer showed in summary when applicant answers yes he has income',
    },
    no: {
      id: 'fa.application:section.incomeForm.summary.no',
      defaultMessage:
        'Ég hef ekki fengið tekjur í þessum eða síðustu tvo mánuði',
      description:
        'Answer showed in summary when applicant answers no he has no income',
    },
  }),
  options: defineMessages({
    yes: {
      id: 'fa.application:section.incomeForm.options.yes',
      defaultMessage: 'Já, ég hef fengið tekjur',
      description: 'Yes option for income question',
    },
    no: {
      id: 'fa.application:section.incomeForm.options.no',
      defaultMessage: 'Nei, engar tekjur',
      description: 'No option for income question',
    },
  }),
}
