import { prosecutorRepresentativeRule, prosecutorRule } from '../../../guards'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Delete rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      IndictmentCountController.prototype.delete,
    )
  })

  it('should give permission to two role', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
  })
})
