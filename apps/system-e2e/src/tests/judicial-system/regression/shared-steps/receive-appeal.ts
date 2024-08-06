import { Page } from '@island.is/testing/e2e'
import { verifyRequestCompletion } from '../../../../support/api-tools'

export const judgeReceivesAppealTest = async (page: Page, caseId: string) => {
  await Promise.all([
    page.goto(`krafa/yfirlit/${caseId}`),
    verifyRequestCompletion(page, '/api/graphql', 'Case'),
  ])
  await page
    .getByRole('button', {
      name: 'Senda tilkynningu um kæru til Landsréttar',
    })
    .click()
  await page.getByTestId('modalPrimaryButton').click()
}
