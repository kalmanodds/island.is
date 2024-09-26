import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // All lists
  signatureCollection: {
    id: 'admin-portal.signature-collection:signatureCollection',
    defaultMessage: 'Söfnun meðmæla',
    description: '',
  },
  signatureListsTitle: {
    id: 'admin-portal.signature-collection:signatureLists',
    defaultMessage: 'Meðmælasafnanir',
    description: '',
  },
  signatureListsTitlePresidential: {
    id: 'admin-portal.signature-collection-parliamentary:signatureLists',
    defaultMessage: 'Forsetakosningar',
    description: '',
  },
  signatureListsConstituencyTitle: {
    id: 'admin-portal.signature-collection:signatureListsConstituencyTitle',
    defaultMessage: 'Kjördæmi',
    description: '',
  },
  signatureListsDescription: {
    id: 'admin-portal.signature-collection:signatureListsDescription',
    defaultMessage:
      'Yfirlit yfir allar meðmælasafnanir sem stofnaðar hafa verið.',
    description: '',
  },
  signatureListsIntro: {
    id: 'admin-portal.signature-collection:signatureListsIntro',
    defaultMessage:
      'Hér er yfirlit yfir allar meðmælasafnanir sem stofnaðar hafa verið. Hægt er að leita að listum og sía eftir landsfjórðungi og frambjóðanda.',
    description: '',
  },
  searchInAllListsPlaceholder: {
    id: 'admin-portal.signature-collection:searchInAllListsPlaceholder',
    defaultMessage: 'Leita eftir nafni, kennitölu eða svæði',
    description: '',
  },
  signatureCollectionInInitialReview: {
    id: 'admin-portal.signature-collection:signatureCollectionInInitialReview',
    defaultMessage:
      'Tímabili söfnunnar hefur verið lokið. Opið er fyrir úrvinnslu.',
    description: '',
  },
  signatureCollectionProcessing: {
    id: 'admin-portal.signature-collection:signatureCollectionProcessing',
    defaultMessage:
      'Úrvinnslu hefur verið lokið á öllum listum. Hægt er að ljúka úrvinnslu á söfnuninni allri.',
    description: '',
  },
  signatureCollectionProcessed: {
    id: 'admin-portal.signature-collection:signatureCollectionProcessed',
    defaultMessage:
      'Úrvinnslu safnanna fyrir upphaflegan söfnunartíma hefur verið lokið. Hægt er að framlengja lista.',
    description: '',
  },
  signatureCollectionActive: {
    id: 'admin-portal.signature-collection:signatureCollectionActive',
    defaultMessage:
      'Söfnunin er opin. Til staðar eru listar sem hafa verið framlengdir. Einnig er hægt að framlengja fleiri lista.',
    description: '',
  },
  signatureCollectionReviewDone: {
    id: 'admin-portal.signature-collection:signatureCollectionReviewDone',
    defaultMessage:
      'Úrvinnslu er lokið á meðmælasöfnunum fyrir forsetaframboð 2024',
    description: '',
  },
  signatureCollectionInReview: {
    id: 'admin-portal.signature-collection:signatureCollectionInReview',
    defaultMessage:
      'Söfnunartíma lokið á þeim listum sem hafa verið framlengdir. Opið er fyrir úrvinnslu.',
    description: '',
  },
  filter: {
    id: 'admin-portal.signature-collection:filter',
    defaultMessage: 'Opna síu',
    description: '',
  },
  filterBy: {
    id: 'admin-portal.signature-collection:filterBy',
    defaultMessage: 'Sía eftir',
    description: '',
  },
  countryArea: {
    id: 'admin-portal.signature-collection:countryArea',
    defaultMessage: 'Landsfjórðungur',
    description: '',
  },
  candidate: {
    id: 'admin-portal.signature-collection:candidate',
    defaultMessage: 'Frambjóðandi',
    description: '',
  },
  nationalId: {
    id: 'admin-portal.signature-collection:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  clearFilter: {
    id: 'admin-portal.signature-collection:clearFilter',
    defaultMessage: 'Hreinsa',
    description: '',
  },
  clearAllFilters: {
    id: 'admin-portal.signature-collection:clearAllFilters',
    defaultMessage: 'Hreinsa allar síur',
    description: '',
  },
  createCollection: {
    id: 'admin-portal.signature-collection:createCollection',
    defaultMessage: 'Stofna söfnun',
    description: '',
  },
  createCollectionSuccess: {
    id: 'admin-portal.signature-collection:createCollectionSuccess',
    defaultMessage: 'Tókst að stofna meðmælasöfnun',
    description: '',
  },
  createCollectionError: {
    id: 'admin-portal.signature-collection:createCollectionError',
    defaultMessage: 'Tókst ekki að stofna meðmælasöfnun',
    description: '',
  },
  createCollectionModalDescription: {
    id: 'admin-portal.signature-collection:createCollectionModalDescription',
    defaultMessage: 'Sláðu inn kennitölu frambjóðanda',
    description: '',
  },
  candidateNationalId: {
    id: 'admin-portal.signature-collection:candidateNationalId',
    defaultMessage: 'Kennitala frambjóðanda',
    description: '',
  },
  candidateNationalIdNotFound: {
    id: 'admin-portal.signature-collection:candidateNationalIdNotFound',
    defaultMessage: 'Kennitala finnst ekki',
    description: '',
  },
  candidateName: {
    id: 'admin-portal.signature-collection:candidateName',
    defaultMessage: 'Nafn frambjóðanda',
    description: '',
  },
  listEndTime: {
    id: 'admin-portal.signature-collection:listEndTime',
    defaultMessage: 'Lokadagur',
    description: '',
  },
  collectionTitle: {
    id: 'admin-portal.signature-collection:collectionTitle',
    defaultMessage: 'Forsetakosningar 2024',
    description: '',
  },
  viewList: {
    id: 'admin-portal.signature-collection:viewList',
    defaultMessage: 'Skoða söfnun',
    description: '',
  },
  viewConstituency: {
    id: 'admin-portal.signature-collection:viewConstituency',
    defaultMessage: 'Skoða kjördæmi',
    description: '',
  },
  noLists: {
    id: 'admin-portal.signature-collection:noLists',
    defaultMessage: 'Engin söfnun í gangi',
    description: '',
  },
  noListsDescription: {
    id: 'admin-portal.signature-collection:noListsDescription',
    defaultMessage: 'Engin meðmælasöfnun hefur verið stöfnuð að því stöddu.',
    description: '',
  },
  noListsFoundBySearch: {
    id: 'admin-portal.signature-collection:noListsFoundBySearch',
    defaultMessage: 'Engin söfnun fannst þegar leitað var að',
    description: '',
  },
  completeCollectionProcessing: {
    id: 'admin-portal.signature-collection:completeCollectionProcessing',
    defaultMessage: 'Úrvinnslu safnanna lokið',
    description: '',
  },
  completeCollectionProcessingModalDescription: {
    id: 'admin-portal.signature-collection:completeCollectionProcessingModalDescription#markdown',
    defaultMessage:
      'Þegar búið er að fara yfir alla meðmælalista skal ýta á hnappinn.',
    description: '',
  },

  /* Hætta við söfnun modal */
  cancelCollectionButton: {
    id: 'dmin-portal.signature-collection:cancelCollectionButton',
    defaultMessage: 'Eyða lista',
    description: '',
  },
  cancelCollectionModalMessage: {
    id: 'dmin-portal.signature-collection:cancelCollectionModalMessage',
    defaultMessage: 'Þú ert að fara að eyða þessum lista. Ertu viss?',
    description: '',
  },
  cancelCollectionModalConfirmButton: {
    id: 'dmin-portal.signature-collection:modalConfirmButton',
    defaultMessage: 'Já, eyða lista',
    description: '',
  },
  cancelCollectionModalCancelButton: {
    id: 'dmin-portal.signature-collection:cancelCollectionModalCancelButton',
    defaultMessage: 'Nei, hætta við',
    description: '',
  },
  cancelCollectionModalToastError: {
    id: 'dmin-portal.signature-collection:modalToastError',
    defaultMessage: 'Ekki tókst að eyða lista',
    description: '',
  },
  cancelCollectionModalToastSuccess: {
    id: 'dmin-portal.signature-collection:cancelCollectionModalToastSuccess',
    defaultMessage: 'Tókst að eyða lista',
    description: '',
  },

  // View list
  singleList: {
    id: 'admin-portal.signature-collection:singleList',
    defaultMessage: 'Meðmælasöfnun',
    description: '',
  },
  singleListIntro: {
    id: 'admin-portal.signature-collection:singleListIntro',
    defaultMessage:
      'Hér birtast nöfn meðmælenda frambjóðandans. Hægt er að framlengja tímafrest söfnunarinnar og bæta við meðmælum af blaði.',
    description: '',
  },
  singleListIntroManage: {
    id: 'admin-portal.signature-collection:singleListIntroManage',
    defaultMessage:
      'Hér birtast nöfn meðmælenda frambjóðandans. Hægt er að leita að meðmælendum eftir nafni eða kennitölu.',
    description: '',
  },
  collectors: {
    id: 'admin-portal.signature-collection:collectors',
    defaultMessage: 'Umboðsaðilar',
    description: '',
  },
  noSignees: {
    id: 'admin-portal.signature-collection:noSignees',
    defaultMessage: 'Engin meðmæli',
    description: '',
  },
  noSigneesFoundBySearch: {
    id: 'admin-portal.signature-collection:noSigneesFoundBySearch',
    defaultMessage: 'Engin meðmæli fundust þegar leitað var að',
    description: '',
  },
  listSigneesNumberHeader: {
    id: 'admin-portal.signature-collection:listSigneesNumberHeader',
    defaultMessage: 'Fjöldi meðmæla',
    description: '',
  },
  listSigneesHeader: {
    id: 'admin-portal.signature-collection:listSigneesHeader',
    defaultMessage: 'Yfirlit meðmæla',
    description: '',
  },
  downloadReports: {
    id: 'admin-portal.signature-collection:downloadReports',
    defaultMessage: 'Sækja skýrslur',
    description: '',
  },
  downloadReportsDescription: {
    id: 'admin-portal.signature-collection:downloadReportsDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec odio ultricies ultricies. Nullam nec purus nec odio ultricies ultricies.',
    description: '',
  },
  downloadButton: {
    id: 'admin-portal.signature-collection:downloadButton',
    defaultMessage: 'Hlaða niður',
    description: '',
  },
  searchInListPlaceholder: {
    id: 'admin-portal.signature-collection:searchInListPlaceholder',
    defaultMessage: 'Leitaðu að nafni eða kennitölu',
    description: '',
  },
  sortBy: {
    id: 'admin-portal.signature-collection:sortBy',
    defaultMessage: 'Raða eftir',
    description: '',
  },
  sortAlphabeticallyAsc: {
    id: 'admin-portal.signature-collection:sortAlphabeticallyAsc',
    defaultMessage: 'A-Ö',
    description: '',
  },
  sortAlphabeticallyDesc: {
    id: 'admin-portal.signature-collection:sortAlphabeticallyDesc',
    defaultMessage: 'Ö-A',
    description: '',
  },
  sortDateAsc: {
    id: 'admin-portal.signature-collection:sortDateAsc',
    defaultMessage: 'Nýjustu fyrst',
    description: '',
  },
  sortDateDesc: {
    id: 'admin-portal.signature-collection:sortDateDesc',
    defaultMessage: 'Elstu fyrst',
    description: '',
  },
  signeeDate: {
    id: 'admin-portal.signature-collection:signeeDate',
    defaultMessage: 'Dagsetning',
    description: '',
  },
  signeeName: {
    id: 'admin-portal.signature-collection:signeeName',
    defaultMessage: 'Nafn',
    description: '',
  },
  signeeNationalId: {
    id: 'admin-portal.signature-collection:signeeNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  signeeAddress: {
    id: 'admin-portal.signature-collection:signeeAddress',
    defaultMessage: 'Heimilisfang',
    description: '',
  },
  updateListEndTime: {
    id: 'admin-portal.signature-collection:updateListEndTime',
    defaultMessage: 'Framlengja lokadag',
    description: '',
  },
  updateListEndTimeSuccess: {
    id: 'admin-portal.signature-collection:updateListEndTimeSuccess',
    defaultMessage: 'Tókst að framlengja lokadag',
    description: '',
  },
  updateListEndTimeError: {
    id: 'admin-portal.signature-collection:updateListEndTimeError',
    defaultMessage: 'Ekki tókst að framlengja lokadag',
    description: '',
  },
  confirmListReviewed: {
    id: 'admin-portal.signature-collection:confirmListReviewed',
    defaultMessage: 'Úrvinnslu lokið',
    description: '',
  },
  confirmListReviewedToggleBack: {
    id: 'admin-portal.signature-collection:confirmListReviewedToggleBack',
    defaultMessage: 'Aflæsa úrvinnslu',
    description: '',
  },
  listReviewedModalDescription: {
    id: 'admin-portal.signature-collection:listReviewedModalDescription#markdown',
    defaultMessage:
      'Þegar búið er að fara yfir meðmælasöfnun skal ýta á hnappinn.',
    description: '',
  },
  listReviewedModalDescriptionToggleBack: {
    id: 'admin-portal.signature-collection:listReviewedModalDescriptionToggleBack#markdown',
    defaultMessage:
      'Þegar þörf eru á að fara yfir meðmælasöfnun aftur skal ýta á hnappinn.',
    description: '',
  },
  listStatusReviewedStatusAlert: {
    id: 'admin-portal.signature-collection:listStatusReviewedStatusAlert',
    defaultMessage: 'Úrvinnslu er lokið á þessari söfnun.',
    description: '',
  },
  listStatusActiveAlert: {
    id: 'admin-portal.signature-collection:listStatusActiveAlert',
    defaultMessage: 'Söfnun á rafrænum meðmælum er í gangi.',
    description: '',
  },
  listStatusInReviewAlert: {
    id: 'admin-portal.signature-collection:listStatusInReviewAlert',
    defaultMessage:
      'Söfnunin er opin fyrir úrvinnslu. Hægt er að hlaða inn meðmælum af blaði.',
    description: '',
  },
  listStatusExtendableAlert: {
    id: 'admin-portal.signature-collection:listStatusExtendableAlert',
    defaultMessage: 'Opið er fyrir framlengingu á söfnun.',
    description: '',
  },
  toggleReviewSuccess: {
    id: 'admin-portal.signature-collection:toggleReviewSuccess',
    defaultMessage: 'Úrvinnslu lokið',
    description: '',
  },
  toggleReviewError: {
    id: 'admin-portal.signature-collection:toggleReviewError',
    defaultMessage: 'Ekki tókst loka úrvinnslu',
    description: '',
  },
  toggleCollectionProcessSuccess: {
    id: 'admin-portal.signature-collection:toggleCollectionProcessSuccess',
    defaultMessage: 'Úrvinnslu safnanna lokið',
    description: '',
  },
  toggleCollectionProcessError: {
    id: 'admin-portal.signature-collection:toggleCollectionProcessError',
    defaultMessage: 'Ekki tókst að loka úrvinnslu safnanna',
    description: '',
  },

  // Upload
  uploadFile: {
    id: 'admin-portal.signature-collection:uploadFile',
    defaultMessage: 'Bæta einning við meðmælum af blaði',
    description: '',
  },
  uploadFileDescription: {
    id: 'admin-portal.signature-collection:uploadFileDescription#markdown',
    defaultMessage:
      'Hlaðið upp skjali með meðmælum viðkomandi frambjóðanda í þessum landsfjórðungi. ',
    description: '',
  },
  uploadHeader: {
    id: 'admin-portal.signature-collection:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: '',
  },
  uploadText: {
    id: 'admin-portal.signature-collection:uploadText',
    defaultMessage: 'Tekið er við skjölum með endingu: .xlsx, .xls',
    description: '',
  },
  downloadTemplate: {
    id: 'admin-portal.signature-collection:downloadTemplate',
    defaultMessage: 'Sækja sniðmat',
    description: '',
  },
  uploadButton: {
    id: 'admin-portal.signature-collection:uploadButton',
    defaultMessage: 'Velja skjöl',
    description: '',
  },
  uploadResultsHeader: {
    id: 'admin-portal.signature-collection:uploadResultsHeader',
    defaultMessage: 'Niðurstöður',
    description: '',
  },
  noUploadResults: {
    id: 'admin-portal.signature-collection:noUploadResults',
    defaultMessage:
      'Engar niðurstöður komu upp úr skjalinu sem hlaðið var upp.',
    description: '',
  },
  totalListResults: {
    id: 'admin-portal.signature-collection:totalListResults',
    defaultMessage: 'Samtals fjöldi',
    description: '',
  },
  totalListsPerConstituency: {
    id: 'admin-portal.signature-collection:totalListsPerConstituency',
    defaultMessage: 'Fjöldi lista: ',
    description: '',
  },
  nationalIdsSuccess: {
    id: 'admin-portal.signature-collection:nationalIdsSuccess',
    defaultMessage: 'Kennitölur sem tókst að hlaða upp',
    description: '',
  },
  nationalIdsError: {
    id: 'admin-portal.signature-collection:nationalIdsError',
    defaultMessage: 'Kennitölur sem mistókst að hlaða upp',
    description: '',
  },

  // Compare lists
  compareLists: {
    id: 'admin-portal.signature-collection:compareLists',
    defaultMessage: 'Bera saman',
    description: '',
  },
  compareListsDescription: {
    id: 'admin-portal.signature-collection:compareListsDescription',
    defaultMessage:
      'Fulltrúar í yfirkjörstjórnum og frambjóðendur geta ekki mælt með framboði',
    description: '',
  },
  compareListsModalDescription: {
    id: 'admin-portal.signature-collection:compareListsModalDescription#markdown',
    defaultMessage:
      'Hlaðið upp skjali með nöfnum og kennitölum fulltrúa yfirkjörstjórna og frambjóðendum til að kanna hvort þau hafi skrifað undir meðmælalista.',
    description: '',
  },
  compareListsResultsHeader: {
    id: 'admin-portal.signature-collection:compareListsResultsHeader',
    defaultMessage: 'Niðurstöður',
    description: '',
  },
  compareListsResultsDescription: {
    id: 'admin-portal.signature-collection:compareListsResultsDescription',
    defaultMessage:
      'Eftirfarandi aðilar eru í yfirkjörstjórn eða landskjörstjórn og ættu ekki að vera skráðir á lista.',
    description: '',
  },
  compareListsNoResultsDescription: {
    id: 'admin-portal.signature-collection:compareListsNoResultsDescription',
    defaultMessage:
      'Enginn fannst í yfirkjörstjórn eða landskjörstjórn sem er skráður á lista.',
    description: '',
  },
  unsignFromList: {
    id: 'admin-portal.signature-collection:unsignFromList',
    defaultMessage: 'Taka af lista',
    description: '',
  },
  unsignFromListSuccess: {
    id: 'admin-portal.signature-collection:unsignFromListSuccess',
    defaultMessage: 'Tókst að taka aðila af lista',
    description: '',
  },

  // Review candidates
  reviewCandidatesModalDescription: {
    id: 'admin-portal.signature-collection:reviewCandidatesModalDescription',
    defaultMessage: 'Fara yfir lista af frambjóðendum',
    description: '',
  },
  removeCandidateFromListModalDescription: {
    id: 'admin-portal.signature-collection:removeCandidateFromListModalDescription',
    defaultMessage: 'Loka lista fyrir frambjóðanda',
    description: '',
  },
  confirmRemoveCandidateFromList: {
    id: 'admin-portal.signature-collection:confirmRemoveCandidateFromList',
    defaultMessage: 'Ertu viss um að þú viljir loka lista fyrir frambjóðanda',
    description: '',
  },
  removeCandidateFromListButton: {
    id: 'admin-portal.signature-collection:removeCandidateFromListButton',
    defaultMessage: 'Já, loka lista',
    description: '',
  },
  removeCandidateFromList: {
    id: 'admin-portal.signature-collection:removeCandidateFromList',
    defaultMessage: 'Loka lista',
    description: '',
  },
  paperSigneesHeader: {
    id: 'admin-portal.signature-collection:paperSigneesHeader',
    defaultMessage: 'Skrá meðmæli af blaði',
    description: '',
  },
  paperSigneesClearButton: {
    id: 'admin-portal.signature-collection:paperSigneesClearButton',
    defaultMessage: 'Hreinsa',
    description: '',
  },
  paperNumber: {
    id: 'admin-portal.signature-collection:paperNumber',
    defaultMessage: 'Blaðsíðunúmer',
    description: '',
  },
  editPaperNumber: {
    id: 'admin-portal.signature-collection:editPaperNumber',
    defaultMessage: 'Breyta blaðsíðunúmeri',
    description: '',
  },
  saveEditPaperNumber: {
    id: 'admin-portal.signature-collection:saveEditPaperNumber',
    defaultMessage: 'Uppfæra blaðsíðunúmer',
    description: '',
  },
  paperSigneeName: {
    id: 'admin-portal.signature-collection:paperSigneeName',
    defaultMessage: 'Nafn meðmælanda',
    description: '',
  },
  signPaperSigneeButton: {
    id: 'admin-portal.signature-collection:signPaperSigneeButton',
    defaultMessage: 'Skrá meðmæli á lista',
    description: '',
  },
  paperSigneeTypoTitle: {
    id: 'admin-portal.signature-collection:paperSigneeTypoTitle',
    defaultMessage: 'Kennitala ekki á réttu formi',
    description: '',
  },
  paperSigneeTypoMessage: {
    id: 'admin-portal.signature-collection:paperSigneeTypoMessage',
    defaultMessage: 'Vinsamlegast athugið kennitöluna og reynið aftur',
    description: '',
  },
  paperSigneeCantSignTitle: {
    id: 'admin-portal.signature-collection:paperSigneeCantSignTitle',
    defaultMessage: 'Ekki er hægt að skrá meðmæli',
    description: '',
  },
  paperSigneeCantSignMessage: {
    id: 'admin-portal.signature-collection:paperSigneeCantSign',
    defaultMessage: 'Kennitala uppfyllir ekki skilyrði fyrir að skrá meðmæli',
    description: '',
  },
  paperSigneeSuccess: {
    id: 'admin-portal.signature-collection:paperSigneeSuccess',
    defaultMessage: 'Meðmæli skráð',
    description: '',
  },
  paperSigneeError: {
    id: 'admin-portal.signature-collection:paperSigneeError',
    defaultMessage: 'Ekki tókst að skrá meðmæli',
    description: '',
  },
})

export const parliamentaryMessages = defineMessages({
  signatureListsTitle: {
    id: 'admin-portal.signature-collection-parliamentary:signatureLists',
    defaultMessage: 'Alþingiskosningar',
    description: '',
  },
  signatureListsDescription: {
    id: 'admin-portal.signature-collection-parliamentary:signatureListsDescription',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: '',
  },
  signatureListsIntro: {
    id: 'admin-portal.signature-collection-parliamentary:signatureListsIntro',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed etiam, ut inquit, in vita et in voluptate locum ponamus, isdem et in dolore et in odio.',
    description: '',
  },
  compareListsButton: {
    id: 'admin-portal.signature-collection-parliamentary:compareListsButton',
    defaultMessage: 'Bera saman',
    description: '',
  },
  compareListsDescription: {
    id: 'admin-portal.signature-collection-parliamentary:compareListsDescription',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description: '',
  },
  singleConstituencyIntro: {
    id: 'admin-portal.signature-collection-parliamentary:singleConstituencyIntro',
    defaultMessage:
      'Hér er yfirlit yfir allar meðmælasafnanir sem stofnaðar hafa verið í',
    description: '',
  },
})

export const createCollectionErrorMessages = defineMessages({
  age: {
    id: 'admin-portal.signature-collection:error.age',
    defaultMessage: '35 ára aldursmark er ekki náð.',
    description: '',
  },
  citizenship: {
    id: 'admin-portal.signature-collection:error.citizenship',
    defaultMessage: 'Eftirfarandi aðili er ekki með íslenkst ríkisfang.',
    description: '',
  },
  residency: {
    id: 'admin-portal.signature-collection:residency',
    defaultMessage: 'Eftirfarandi aðili er ekki með búsetu á Íslandi.',
    description: '',
  },
  active: {
    id: 'admin-portal.signature-collection:error.active',
    defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
    description: '',
  },
  owner: {
    id: 'admin-portal.signature-collection:error.owner',
    defaultMessage: 'Eftirfarandi aðili er þegar eigandi meðmæsöfnunar.',
    description: '',
  },
  deniedByService: {
    id: 'admin-portal.signature-collection:error.deniedByService',
    defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
    description: '',
  },
})
