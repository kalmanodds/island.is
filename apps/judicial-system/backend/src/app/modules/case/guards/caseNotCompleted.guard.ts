import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { completedCaseStates } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

@Injectable()
export class CaseNotCompletedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (completedCaseStates.includes(theCase.state)) {
      throw new ForbiddenException('Forbidden for completed cases')
    }

    return true
  }
}
