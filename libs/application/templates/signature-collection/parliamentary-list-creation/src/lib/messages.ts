import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationName: {
    id: 'plc.application:applicationName',
    defaultMessage: 'Alþingiskosningar - stofna meðmælasöfnun',
    description: '',
  },
  institution: {
    id: 'plc.application:institution',
    defaultMessage: 'Þjóðskrá',
    description: '',
  },

  /* Inngangur */
  intro: {
    id: 'plc.application:intro',
    defaultMessage: 'Um söfnunina',
    description: '',
  },
  introTitle: {
    id: 'plc.application:introTitle',
    defaultMessage: 'Alþingiskosningar',
    description: '',
  },
  introDescription: {
    id: 'plc.application:introDescription#markdown',
    defaultMessage:
      'Þú ert að fara að stofna meðmælasöfnun fyrir stjórnmálasamtök vegna Alþingiskosninga. Athugaðu að óheimilt er að afrita, miðla eða nýta upplýsingar um meðmælendur í nokkrum öðrum tilgangi en að safna þeim til þess að skila inn framboði.',
    description: '',
  },

  /* Gagnaöflun */
  dataCollection: {
    id: 'plc.application:dataCollection',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'plc.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'plc.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionSubmit: {
    id: 'plc.application:dataCollectionSubmit',
    defaultMessage: 'Staðfesta',
    description: '',
  },

  /* Providers */
  nationalRegistryProviderTitle: {
    id: 'plc.application:nationalRegistryProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  nationalRegistryProviderSubtitle: {
    id: 'plc.application:nationalRegistryProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  userProfileProviderTitle: {
    id: 'plc.application:userProfileProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  userProfileProviderSubtitle: {
    id: 'plc.application:userProfileProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },

  /* Upplýsingar um meðmælalista */
  listInformationSection: {
    id: 'plc.application:listInformationSection',
    defaultMessage: 'Upplýsingar um stjórnmálasamtök og tengilið',
    description: '',
  },
  listInformationDescription: {
    id: 'plc.application:listInformationDescription#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet imperdiet odio.',
    description: '',
  },
  information: {
    id: 'plc.application:information',
    defaultMessage: 'Upplýsingar',
    description: '',
  },
  listHeader: {
    id: 'plc.application:listHeader',
    defaultMessage: 'Stjórnmálasamtök',
    description: '',
  },
  applicantActorHeader: {
    id: 'plc.application:applicantActorHeader',
    defaultMessage: 'Tengiliður',
    description: '',
  },
  name: {
    id: 'plc.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  listName: {
    id: 'plc.application:listName',
    defaultMessage: 'Heiti stjórnmálasamtaka',
    description: '',
  },
  listLetter: {
    id: 'plc.application:listLetter',
    defaultMessage: 'Listabókstafur',
    description: '',
  },
  nationalId: {
    id: 'plc.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  phone: {
    id: 'plc.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'plc.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },
  collectionHeader: {
    id: 'plc.application:collectionHeader',
    defaultMessage: 'Söfnun meðmæla',
    description: '',
  },
  collectionDateFrom: {
    id: 'plc.application:collectionDateFrom',
    defaultMessage: 'Upphafsdagsetning',
    description: '',
  },
  collectionDateTil: {
    id: 'plc.application:collectionDateTil',
    defaultMessage: 'Lokadagsetning',
    description: '',
  },

  /* Kjördæmi */
  constituency: {
    id: 'plc.application:constituency',
    defaultMessage: 'Kjördæmi',
    description: '',
  },
  allConstituencies: {
    id: 'plc.application:allConstituencies',
    defaultMessage: 'Öll kjördæmi',
    description: '',
  },
  selectConstituency: {
    id: 'plc.application:selectConstituency',
    defaultMessage: 'Veljið kjördæmi',
    description: '',
  },
  selectConstituencyDescription: {
    id: 'plc.application:selectConstituencyDescription',
    defaultMessage:
      'Hægt er að velja eitt eða fleiri kjördæmi eftir því hvort stjórnmálasamtökin ætli sér að bjóða fram í öllum kjördæmum eða færri kjördæmum.',
    description: '',
  },

  /* Ábyrgðaraðilar */
  managersAndSupervisors: {
    id: 'plc.application:managersAndSupervisors',
    defaultMessage: 'Ábyrgðar-/umsjónaraðilar',
    description: '',
  },
  managersAndSupervisorsTitle: {
    id: 'plc.application:managersAndSupervisorsTitle',
    defaultMessage: 'Veljið ábyrgðar- og umsjónaraðila',
    description: '',
  },
  managers: {
    id: 'plc.application:managers',
    defaultMessage: 'Ábyrgðaraðilar',
    description: '',
  },
  managersDescription: {
    id: 'plc.application:managersDescription',
    defaultMessage:
      'Ábyrgðaraðili hefur aðgang að söfnunum í öllum kjördæmum og getur bætt við og eytt umsjónaraðilum. Ábyrgðaraðili getur slegið inn kennitölur meðmælenda af blaði í viðeigandi kjördæmum.',
    description: '',
  },
  addManager: {
    id: 'plc.application:addManager',
    defaultMessage: 'Bæta við ábyrgðaraðila',
    description: '',
  },

  /* Umsjónaraðilar */
  supervisors: {
    id: 'plc.application:supervisors',
    defaultMessage: 'Umsjónaraðilar',
    description: '',
  },
  supervisorsDescription: {
    id: 'plc.application:supervisorsDescription',
    defaultMessage:
      'Umsjónaraðili sér aðeins þau kjördæmi sem honum hefur verið úthlutað og getur slegið inn kennitölur meðmælenda af blaði í þeim kjördæmum.',
    description: '',
  },
  addSupervisor: {
    id: 'plc.application:addSupervisor',
    defaultMessage: 'Bæta við umsjónaraðila',
    description: '',
  },

  /* Yfirlit */
  overview: {
    id: 'plc.application:overview',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewDescription: {
    id: 'plc.application:overviewDescription#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet imperdiet odio, id ornare ante tincidunt ac. Phasellus massa velit, condimentum quis est id, tristique vestibulum lectus.',
    description: '',
  },
  applicantOverviewHeader: {
    id: 'plc.application:applicantOverviewHeader',
    defaultMessage: 'Upplýsingar um tengilið',
    description: '',
  },
  listOverviewHeader: {
    id: 'plc.application:listOverviewHeader',
    defaultMessage: 'Upplýsingar um stjórnmálasamtök',
    description: '',
  },
  listsOverviewHeader: {
    id: 'plc.application:listOverviewHeader',
    defaultMessage: 'Upplýsingar um meðmælalista',
    description: '',
  },
  listDateTil: {
    id: 'plc.application:listDateTil',
    defaultMessage: 'Lokadagur',
    description: '',
  },
  createList: {
    id: 'plc.application:createList',
    defaultMessage: 'Stofna meðmælasöfnun',
    description: '',
  },

  /* Listi stofnaður */
  listCreated: {
    id: 'plc.application:listCreated',
    defaultMessage: 'Meðmælasöfnun stofnuð',
    description: '',
  },
  listCreatedDescription: {
    id: 'plc.application:listCreatedDescription#markdown',
    defaultMessage:
      'Hægt er að fylgjast með stöðu meðmæla eftir kjördæmum á Mínum síðum. Einnig er hægt að veita umboð til ábyrgðaraðila og umsjónaraðila á Mínum síðum. Meðmælendur sjá sín meðmæli á Mínum síðum á Ísland.is. Framboðsfresti lýkur xx. mánuð og þá lokar sjálfkrafa fyrir söfnun meðmæla.',
    description: '',
  },
  nextSteps: {
    id: 'plc.application:nextSteps',
    defaultMessage: 'Næstu skref',
    description: '',
  },
  nextStepsDescription: {
    id: 'plc.application:nextStepsDescription#markdown',
    defaultMessage:
      'Nú er hægt að safna meðmælum! Hægt er að afrita og deila hlekknum til fólks svo þau geti á einfaldan hátt mælt með stjórnmálasamtökunum í viðeigandi kjördæmi.',
    description: '',
  },
  shareList: {
    id: 'plc.application:shareList',
    defaultMessage: 'Deila meðmælalista',
    description: '',
  },
  shareListLink: {
    id: 'plc.application:shareListLink',
    defaultMessage: 'https://island.is/umsoknir/maela-med-althingis-frambodi',
    description: '',
  },
  copyLink: {
    id: 'plc.application:copyLink',
    defaultMessage: 'Afrita hlekk',
    description: '',
  },
  linkFieldButtonTitle: {
    id: 'plc.application:linkFieldButtonTitle',
    defaultMessage: 'Mínar síður',
    description: '',
  },
  linkFieldMessage: {
    id: 'plc.application:linkFieldMessage',
    defaultMessage:
      'Á mínum síðum sést hve mörgum meðmælum hefur verið safnað í hverjum landsfjórðungi.',
    description: '',
  },

  /* Action Card logs */
  logListCreated: {
    id: 'plc.application:listCreated',
    defaultMessage: 'Meðmælalisti stofnaður',
    description: '',
  },

  /* Validation error messages */
  constituencyValidationError: {
    id: 'plc.application:constituencyValidationError',
    defaultMessage: 'Velja þarf að minnsta kosti eitt kjördæmi',
    description: '',
  },
  nationalIdValidationError: {
    id: 'plc.application:managerValidationError',
    defaultMessage: 'Ógild kennitala',
    description: '',
  },
})
