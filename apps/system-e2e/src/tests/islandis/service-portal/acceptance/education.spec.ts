import { BrowserContext, expect, test } from '@playwright/test'
import { setupXroadMocks } from './setup-xroad.mocks'

import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Social Insurance', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
    await setupXroadMocks()
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should display secondary education graduation overview', async () => {
    // Arrange
    const page = await context.newPage()

    await setupXroadMocks()
    await disableI18n(page)

    await page.goto(
      icelandicAndNoPopupUrl('minarsidur/menntun/framhaldsskoli/namsferill'),
    )

    // Act
    const headline = page.getByRole('heading', {
      name: 'Námsferill',
    })

    // Assert
    await expect(headline).toBeVisible({ timeout: 10000 })
  })
})
