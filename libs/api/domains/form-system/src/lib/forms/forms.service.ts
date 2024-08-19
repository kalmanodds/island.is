import { Injectable, Inject } from "@nestjs/common";
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from "@apollo/client";
import { handle4xx } from "../../utils/errorHandler";
import { FormsApi, FormsControllerCreateRequest, FormsControllerDeleteRequest, FormsControllerFindAllRequest, FormsControllerFindOneRequest } from '@island.is/clients/form-system'
import { CreateFormInput, DeleteFormInput, GetAllFormsInput, GetFormInput } from "../../dto/form.input";
import { Form, FormResponse } from "../../models/form.model";

@Injectable()
export class FormsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsService: FormsApi
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in forms service', err)

    throw new ApolloError(error.message)
  }

  private formsApiWithAuth(auth: User) {
    return this.formsService.withMiddleware(new AuthMiddleware(auth))
  }

  async createForm(auth: User, input: CreateFormInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth)
      .formsControllerCreate(
        input as FormsControllerCreateRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to create form'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as FormResponse
  }

  async deleteForm(auth: User, input: DeleteFormInput): Promise<void> {
    const response = await this.formsApiWithAuth(auth)
      .formsControllerDelete(
        input as FormsControllerDeleteRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete form'))

    if (!response || response instanceof ApolloError) {
      return
    }

    return
  }

  async getForm(auth: User, input: GetFormInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth)
      .formsControllerFindOne(
        input as FormsControllerFindOneRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get form'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as Form
  }

  async getAllForms(auth: User, input: GetAllFormsInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth)
      .formsControllerFindAll(
        input as FormsControllerFindAllRequest
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to get all forms'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as FormResponse
  }

}
