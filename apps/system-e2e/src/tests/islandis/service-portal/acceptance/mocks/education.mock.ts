import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { Education } from '../../../../../../../../infra/src/dsl/xroad'
import { StudentAssessmentResponse } from '@island.is/clients/mms'

export const loadEducationMocks = async () => {
  const response: StudentAssessmentResponse = {
    einkunnir: [
      {
        bekkur: 'Fyrsti',
        namsgreinar: [
          {
            heiti: 'Testfræði',
            dagsetning: '2022-06-25T00:00:00.000Z',
            haefnieinkunn: 'A',
            haefnieinkunnStada: 'B',
            samtals: {
              heiti: 'Gott',
              radeinkunn: {
                einkunn: 'C',
                heiti: 'Gott st0ff',
                vaegi: 8,
              },
              grunnskolaeinkunn: {
                einkunn: 'A',
                heiti: 'Gott st0ff',
                vaegi: 4,
              },
            },
            framfaraTexti: {
              einkunn: 'B',
              heiti: 'Hraðlært',
              vaegi: 6,
            },
            einkunnir: [
              {
                heiti: 'Gott',
                radeinkunn: {
                  einkunn: 'C',
                  heiti: 'Gott st0ff',
                  vaegi: 3,
                },
                grunnskolaeinkunn: {
                  einkunn: 'A',
                  heiti: 'Gott st0ff',
                  vaegi: 0,
                },
              },
            ],
            ordOgTalnadaemi: {
              einkunn: 'B',
              heiti: 'Hraðlært',
              vaegi: 15108,
            },
          },
        ],
      },
    ],
  }
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
    apiPath: '/api/v2/public/studentAssessments/1234567890',
    response: [new Response().withJSONBody(response)],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
    apiPath: '/api/v2/public/studentAssessments/9087654321',
    response: [
      new Response().withJSONBody({
        einkunnir: [
          {
            bekkur: 'Fyrsti',
            namsgreinar: [
              {
                heiti: 'Testfræði',
                dagsetning: '2022-06-25T00:00:00.000Z',
                haefnieinkunn: 'A',
                haefnieinkunnStada: 'B',
                samtals: {
                  heiti: 'Gott',
                  radeinkunn: {
                    einkunn: 'I',
                    heiti: 'Upp upp',
                    vaegi: '642',
                  },
                  grunnskolaeinkunn: {
                    einkunn: 'A+',
                    heiti: 'Stonks',
                    vaegi: '10',
                  },
                },
                framfaraTexti: {
                  einkunn: 'E',
                  heiti: 'Slowy',
                  vaegi: '1',
                },
                einkunnir: [
                  {
                    heiti: 'Gott',
                    radeinkunn: {
                      einkunn: 'C',
                      heiti: 'Gott st0ff',
                      vaegi: '8',
                    },
                    grunnskolaeinkunn: {
                      einkunn: 'D',
                      heiti: 'Næs',
                      vaegi: '2',
                    },
                  },
                ],
                ordOgTalnadaemi: {
                  einkunn: 'B',
                  heiti: 'Hraðlært',
                  vaegi: '8',
                },
              },
            ],
          },
        ],
      }),
    ],
  })
}
