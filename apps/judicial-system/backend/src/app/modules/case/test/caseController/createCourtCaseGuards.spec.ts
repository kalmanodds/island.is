import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Create court case guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.createCourtCase,
    )
  })

  it('should have the right guard configuration', () => {
    expect(guards).toHaveLength(4)
    expect(new guards[0]()).toBeInstanceOf(JwtAuthGuard)
    expect(new guards[1]()).toBeInstanceOf(RolesGuard)
    expect(new guards[2]()).toBeInstanceOf(CaseExistsGuard)
    expect(new guards[3]()).toBeInstanceOf(CaseWriteGuard)
  })
})
