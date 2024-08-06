import {
  BrowserContext,
  expect,
  test,
  icelandicAndNoPopupUrl,
  urls,
  session,
  label,
  disableI18n,
  helpers,
} from '@island.is/testing/e2e'
import { mNotifications } from '@island.is/service-portal/information/messages'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

const servicePortalNotifications = icelandicAndNoPopupUrl(
  '/minarsidur/min-gogn/stillingar/tilkynningar',
)

test.describe('Notification settings', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-notification-settings.json',
      homeUrl,
      phoneNumber: '0102399', // Gervimaður Færeyjar
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should show notification settings page', async () => {
    const page = await context.newPage()
    const { findByRole } = helpers(page)

    // Arrange
    await page.goto(icelandicAndNoPopupUrl(servicePortalNotifications))
    await disableI18n(page)

    // Act + Assert
    await test.step('should have page title', async () => {
      await expect(findByRole('heading', 'Tilkynningar')).toBeVisible()
    })

    await test.step(
      'should have notification settings controls for user',
      async () => {
        await expect(findByRole('heading', 'Gervimaður Færeyjar')).toBeVisible()

        // email notification settings toggle button
        await expect(
          findByRole(
            'button',
            label(mNotifications.emailNotificationsAriaLabel),
          ),
        ).toBeVisible()

        // app notification settings toggle button
        await expect(
          findByRole('button', label(mNotifications.appNotificationsAriaLabel)),
        ).toBeVisible()
      },
    )

    await test.step(
      "should have notification settings controls for user's delegations",
      async () => {
        await expect(
          findByRole('heading', label(mNotifications.delegations)),
        ).toBeVisible()

        // should see list of delegations
        const delegationList = page.getByTestId('actor-profile-settings-list')
        await expect(delegationList).toBeVisible()

        const delegation = delegationList.getByRole('listitem').first()

        // email notification settings toggle button
        await expect(delegation).toBeVisible()
        await expect(
          delegation.getByRole('button', {
            name: label(mNotifications.emailNotificationsAriaLabel),
          }),
        ).toBeVisible()
      },
    )
  })
})
