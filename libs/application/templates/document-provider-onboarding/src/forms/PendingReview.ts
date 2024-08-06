import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { ApplicationTypes, Form, FormModes } from '@island.is/application/types'

import { m } from '../lib/messages'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: '',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildMultiField({
      id: 'pendingReview',
      title: m.pendingReviewthankYouScreenTitle,
      children: [
        buildDescriptionField({
          id: 'pendingReviewDescription',
          title: m.thankYouScreenSubTitle,
          titleVariant: 'h4',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'pendingReviewDescription',
          title: '',
          description: m.thankYouScreenFirstMessage,
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'pendingReviewDescription2',
          title: '',
          description: m.thankYouScreenSecondMessage,
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'pendingReviewDescription3',
          title: '',
          description: m.thankYouScreenThirdMessage,
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'pendingReviewLink1',
          title: '',
          description: m.thankYouScreenLink1,
          marginTop: 2,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'pendingReviewLink2',
          title: '',
          description: m.thankYouScreenLink2,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'pendingReviewLink3',
          title: '',
          description: m.thankYouScreenLink3,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'pendingReviewDescription4',
          title: '',
          description: m.thankYouScreenFooterMessage,
          marginBottom: 3,
        }),
      ],
    }),
  ],
})
