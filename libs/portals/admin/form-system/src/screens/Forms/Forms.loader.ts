import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm, FormSystemFormResponse } from '@island.is/api/schema'
import { GET_FORMS } from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'

export interface FormsLoaderQueryResponse {
  formSystemGetAllForms?: FormSystemFormResponse
}

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
}

export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<FormsLoaderResponse> => {
    const { data, error } = await client.query<FormsLoaderQueryResponse>({
      query: GET_FORMS,
      variables: {
        input: {
          organizationId: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39',
        },
      },
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }
    return {
      forms: data.formSystemGetAllForms?.forms?.filter(
        (form) => form !== null,
      ).map(form => removeTypename(form)) as FormSystemForm[],
    }
  }
}
