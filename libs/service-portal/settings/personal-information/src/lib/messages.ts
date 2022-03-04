import { defineMessages } from 'react-intl'

export const msg = defineMessages({
  saveEmail: {
    id: 'sp.settings:save-email',
    defaultMessage: 'Vista netfang',
  },
  editEmailText: {
    id: 'sp.settings:edit-email-text',
    defaultMessage:
      'Þegar þú vistar netfang komum við til með að senda þér staðfestingarkóða með tölvupósti til að tryggja það að netfangið sé rétt skráð. Ef staðfestingar póstur berst ekki er gott að kanna hvort hann sé í möppu fyrir ruslpóst. Staðfestingarkóðann seturu inn hér að neðan til staðfestingar um að þú hafir fengið hann sendann.',
  },
  saveTel: {
    id: 'sp.settings:save-tel',
    defaultMessage: 'Vista símanúmer',
  },
  editTelText: {
    id: 'sp.settings:edit-tel-text',
    defaultMessage:
      'Þegar þú vistar símanúmer komum við til með að senda þér staðfestingarkóða með SMS til að tryggja það að símanúmerið sé rétt skráð. Staðfestingarkóðann seturu inn hér að neðan til staðfestingar um að þú hafir fengið hann sendann.',
  },
  editBankInfoText: {
    id: 'sp.settings:edit-bankInfo-text',
    defaultMessage: `
    Hér getur þú gert breytingar á þeim bankareikningi
    sem þú vilt nota í kerfum island.is.
  `,
  },
  editNudgeText: {
    id: 'sp.settings:edit-nudge-text',
    defaultMessage: `Við munum senda þér tölvupóst þegar þú færð markvisst skjal í pósthólfið þitt.`,
  },
  overlayIntro: {
    id: 'sp.settings:overlay-intro-text',
    defaultMessage: `Við komum til með að senda á þig mikilvægar tilkynningar og því er gott að vera með netfang og síma rétt skráð.`,
  },
  dropModalAllTitle: {
    id: 'sp.settings:dropmodal-all-title',
    defaultMessage: 'Engar upplýsingar skráðar',
  },
  dropModalAllText: {
    id: 'sp.settings:dropmodal-all-text',
    defaultMessage:
      'Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með netfang og símanúmer skráð.',
  },
  dropModalEmailTitle: {
    id: 'sp.settings:dropmodal-email-title',
    defaultMessage: 'Engar netfangs upplýsingar skráðar',
  },
  dropModalEmailText: {
    id: 'sp.settings:dropmodal-email-text',
    defaultMessage: `Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með netfang skráð.`,
  },
  dropModalTelTitle: {
    id: 'sp.settings:dropmodal-tel-title',
    defaultMessage: 'Engar símanúmers upplýsingar skráðar',
  },
  dropModalTelText: {
    id: 'sp.settings:dropmodal-tel-text',
    defaultMessage: `Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með símanúmer skráð.`,
  },
  dropModalContinue: {
    id: 'sp.settings:dropmodal-continue-button',
    defaultMessage: 'Skrá',
  },
  dropModalDrop: {
    id: 'sp.settings:dropmodal-drop-button',
    defaultMessage: 'Vil ekki skrá',
  },
  errorOnlyNumbers: {
    id: 'sp.settings:only-numbers-allowed',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  errorBankInputMaxLength: {
    id: 'sp.settings:bankInfo-required-length-msg',
    defaultMessage: `Númer banka er í mesta lagi 4 stafir`,
  },
  errorLedgerInputMaxLength: {
    id: 'sp.settings:bankInfo-hb-required-length-msg',
    defaultMessage: `Höfuðbók er í mesta lagi 2 stafir`,
  },
  errorAccountInputMaxLength: {
    id: 'sp.settings:bankInfo-account-required-length-msg',
    defaultMessage: `Reikningsnúmer er í mesta lagi 6 stafir.`,
  },
  errorBankInfoService: {
    id: 'sp.settings:bankInfo-service',
    defaultMessage: `Villa við að vista þennan reikning á þína kennitölu`,
  },
  inputBankLabel: {
    id: 'sp.settings:bankInfo-input-bank',
    defaultMessage: `Banki`,
  },
  inputLedgerLabel: {
    id: 'sp.settings:bankInfo-input-hb',
    defaultMessage: `Hb.`,
  },
  inputAccountNrLabel: {
    id: 'sp.settings:bankInfo-input-accountNr',
    defaultMessage: `Reikningsnúmer`,
  },
  buttonAccountSave: {
    id: 'sp.settings:bankInfo-button-save',
    defaultMessage: `Vista reikningsnúmer`,
  },
  buttonChange: {
    id: 'sp.settings:button-change',
    defaultMessage: `Breyta`,
  },
  saveSettings: {
    id: 'sp.settings:save-settings',
    defaultMessage: `Vista stillingar`,
  },
  errorTelReqLength: {
    id: 'sp.settings:tel-required-length-msg',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  saveEmptyChange: {
    id: 'sp.settings:save-empty',
    defaultMessage: 'Vista tómt',
  },
})
