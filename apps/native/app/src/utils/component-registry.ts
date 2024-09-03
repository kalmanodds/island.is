import { bundleId, isTestingApp } from '../config'

const prefix = bundleId

export const ComponentRegistry = {
  // dev screens
  DevtoolsStorybookScreen: `${prefix}.screens.DevStorybook`,
  DevtoolsCognitoAuthScreen: `${prefix}.screens.DevCognitoAuth`,

  // screens
  LoginScreen: `${prefix}.screens.${isTestingApp ? `TestingLogin` : `Login`}`,
  CognitoAuthScreen: `${prefix}.screens.CognitoAuth`,
  AppLockScreen: `${prefix}.screens.AppLock`,
  OnboardingPinCodeScreen: `${prefix}.screens.OnboardingPinCode`,
  OnboardingBiometricsScreen: `${prefix}.screens.OnboardingBiometrics`,
  OnboardingNotificationsScreen: `${prefix}.screens.OnboardingNotifications`,
  HomeScreen: `${prefix}.screens.Home`,
  InboxScreen: `${prefix}.screens.Inbox`,
  ApplicationsScreen: `${prefix}.screens.ApplicationsScreen`,
  WalletScreen: `${prefix}.screens.Wallet`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  WalletPassportScreen: `${prefix}.screens.WalletPassport`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  NotificationsScreen: `${prefix}.screens.Notifications`,
  WebViewScreen: `${prefix}.screens.WebViewScreen`,
  LicenseScannerScreen: `${prefix}.screens.LicenseScannerScreen`,
  LicenseScanDetailScreen: `${prefix}.screens.LicenseScanDetailScreen`,
  VehiclesScreen: `${prefix}.screens.VehiclesScreen`,
  VehicleDetailScreen: `${prefix}.screens.VehicleDetailScreen`,
  VehicleMileageScreen: `${prefix}.screens.VehicleMileageScreen`,
  AssetsOverviewScreen: `${prefix}.screens.AssetsOverviewScreen`,
  AssetsDetailScreen: `${prefix}.screens.AssetsDetailScreen`,
  MoreScreen: `${prefix}.screens.MoreScreen`,
  PersonalInfoScreen: `${prefix}.screens.PersonalInfoScreen`,
  SettingsScreen: `${prefix}.screens.SettingsScreen`,
  FamilyScreen: `${prefix}.screens.FamilyScreen`,
  FamilyDetailScreen: `${prefix}.screens.FamilyDetailScreen`,
  EditPhoneScreen: `${prefix}.screens.EditPhoneScreen`,
  EditEmailScreen: `${prefix}.screens.EditEmailScreen`,
  EditBankInfoScreen: `${prefix}.screens.EditBankInfoScreen`,
  EditConfirmScreen: `${prefix}.screens.EditConfirmScreen`,
  FinanceScreen: `${prefix}.screens.FinanceScreen`,
  FinanceStatusDetailScreen: `${prefix}.screens.FinanceStatusDetailScreen`,
  InboxFilterScreen: `${prefix}.screens.InboxFilterScreen`,
  AirDiscountScreen: `${prefix}.screens.AirDiscountScreen`,

  // custom navigation icons
  OfflineIcon: `${prefix}.navigation.OfflineIcon`,

  // overlays
  OfflineBanner: `${prefix}.overlay.OfflineBanner`,
  PasskeyScreen: `${prefix}.screens.PasskeyScreen`,
}

export const ButtonRegistry = {
  LoadingButton: `${prefix}.button.LoadingButton`,
  OfflineButton: `${prefix}.button.OfflineButton`,
  SettingsButton: `${prefix}.button.SettingsButton`,
  // to do remove this unused user button
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`,
  ShareButton: `${prefix}.button.ShareButton`,
  ScanLicenseButton: `${prefix}.button.ScanLicenseButton`,
  ScanLicenseDoneButton: `${prefix}.button.ScanLicenseDoneButton`,
  DocumentStarButton: `${prefix}.button.DocumentStarButton`,
  DocumentArchiveButton: `${prefix}.button.DocumentArchiveButton`,
  InboxFilterClearButton: `${prefix}.button.InboxFilterClearButton`,
}

export const StackRegistry = {
  LoginStack: `${prefix}.stack.LoginStack`,
  InboxStack: `${prefix}.stack.InboxStack`,
  HomeStack: `${prefix}.stack.HomeStack`,
  WalletStack: `${prefix}.stack.WalletStack`,
  LicenseScannerStack: `${prefix}.stack.LicenseScannerStack`,
  MoreStack: `${prefix}.stack.MoreStack`,
  ApplicationsStack: `${prefix}.stack.ApplicationsStack`,
}

export const MainBottomTabs = `${prefix}.bottomTabs.MainBottomTabs`
