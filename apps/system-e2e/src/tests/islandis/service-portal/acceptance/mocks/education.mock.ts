import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import { Education } from '../../../../../../../../infra/src/dsl/xroad'

export const loadEducationXroadMocks = async (userNatId: string) => {
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Education,
    prefix: 'XROAD_MMS_GRADE_SERVICE_ID',
    apiPath: `/api/v2/public/studentAssessments/${userNatId}`,
    response: [
      new Response().withJSONBody({
        einkunnir: [
          {
            bekkur: '3. bekkur',
            namsgreinar: [{
              heiti: 'Platfræði',
              dagsetning: '2023-11-29T00:00:00.000Z',
              haefnieinkunn: 'B',
              haefnieinkunnStada: 'Flott bara',
              samtals: {
                heiti: 'Bubb',
                radeinkunn: {
                  einkunn: 'A',
                  heiti: 'gubb',
                  vaegi: 3
                },
                grunnskolaeinkunn: {
                  einkunn: 'A',
                  heiti: 'gubb',
                  vaegi: 3
                }
              },
              framfaraTexti:

            }]
          }
        ]
       })})
}
