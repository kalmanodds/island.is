import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { NationalRegistryB2C } from '../../../../../../../../infra/src/dsl/xroad'
import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'

export const loadNationalRegistryMocks = async () => {
  const response: EinstaklingurDTOAllt = {
    kennitala: '1234567890',
    nafn: 'Test gal',
    tegundKennitolu: 'Test kennitala',
    tegundEinstaklingsNr: 1,
    tegundEinstaklingsLysing: 'Test kennitala',
    bannmerking: false,
    afdrif: null,
    heimilisfang: {
      husHeiti: 'Þúfubarð 11',
      ibud: null,
      postnumer: '999',
      poststod: 'Norðurpóll',
      sveitarfelag: 'Stöðvarfjörður',
      tegundHeimilisfangs: 'Lögheimili',
    },
    logheimilistengsl: {
      logheimilistengsl: '101010',
      logheimilismedlimir: [
        {
          kennitala: '123',
          nafn: 'Test gal',
        },
        {
          kennitala: '456',
          nafn: 'Test gæ',
        },
        {
          kennitala: '789',
          nafn: 'Test fly',
        },
      ],
    },
    itarupplysingar: {
      logheimiliskodi: '987654321',
      logheimiliskodi112: '987654321',
      logheimiliskodiSIsl: null,
      adsetur: {
        husHeiti: null,
        ibud: null,
        postnumer: null,
        poststod: null,
        sveitarfelag: null,
        tegundHeimilisfangs: 'Aðsetur',
      },
    },
    hjuskaparstada: {
      hjuskaparstadaKodi: '1',
      hjuskaparstadaTexti: 'Ógift(ur)',
      sambudTexti: false,
      makiKennitala: null,
      makiNafn: null,
    },
    kyn: {
      kynKodi: '4',
      kynTexti: 'Testbot',
    },
    rikisfang: {
      rikisfangKodi: 'TH',
      rikisfangLand: 'Thule',
    },
    forsja: {
      born: [
        {
          barnKennitala: '9087654321',
          barnNafn: 'Test pal',
          forsjaAdiliKennitala: '1234567890',
          forsjaAdiliNafn: 'Test gal',
          forsjaKodi: '26',
          forsjaTexti: 'Sameiginleg forsjá, Ekki lögheimilisforeldri',
          forsjaAdiliFaedingardagur: new Date('1930-01-01T00:00:00'),
        },
      ],
      forsjaradilar: [
        {
          barnKennitala: '123',
          barnNafn: 'Test gal',
          forsjaAdiliKennitala: '456',
          forsjaAdiliNafn: 'Test gæ',
          forsjaKodi: '26',
          forsjaTexti: 'Sameiginleg forsjá, Ekki lögheimilisforeldri',
          forsjaAdiliFaedingardagur: new Date('1930-01-01T00:00:00'),
        },
        {
          barnKennitala: '123',
          barnNafn: 'Test gal',
          forsjaAdiliKennitala: '789',
          forsjaAdiliNafn: 'Test fly',
          forsjaKodi: '24',
          forsjaTexti: 'Sameiginleg forsjá, Lögheimilisforeldri',
          forsjaAdiliFaedingardagur: new Date('1901-01-01T00:00:00'),
        },
      ],
    },
    faedingarstadur: {
      faedingarDagur: new Date('1850-01-01T00:00:00'),
      faedingarStadurKodi: '0000',
      faedingarStadurHeiti: 'Suðureyri',
    },
    logforeldrar: {
      logForeldrar: [
        {
          barnKennitala: '123',
          barnNafn: 'Test gal',
          logForeldriKennitala: '1011',
          logForeldriNafn: 'Test spy',
          logForeldriFaedingardagur: new Date('1980-12-13T00:00:00'),
        },
      ],
      born: [
        {
          barnKennitala: '9087654321',
          barnNafn: 'Test pal',
          logForeldriKennitala: '1234567890',
          logForeldriNafn: 'Test gal',
          logForeldriFaedingardagur: new Date('1930-01-01T00:00:00'),
        },
      ],
    },
    fulltNafn: {
      eiginNafn: 'Test',
      milliNafn: '',
      kenniNafn: 'gal',
      fulltNafn: 'Test gal',
      nafnStadfest: 'true',
    },
    nyskraningDagsetning: {
      nyskraningDagur: null,
    },
    trufelag: {
      trufelagKodi: '6',
      trufelagHeiti: 'Hvítasunnukirkjan á Íslandi',
    },
  }

  await addXroadMock({
    prefixType: 'only-base-path',
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_PATH',
    apiPath: '/Midlun/v1/Einstaklingar/0101302399',
    response: [new Response().withJSONBody(response)],
  })
}
