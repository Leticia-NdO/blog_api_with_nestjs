import { UserResponse } from '../../types/user-response.interface'
import { FindUserByEmailRepositoryInterface } from '../domain/repository/find-user-by-email-repository-interface'
import { buildUserResponse } from './helpers/user-response-helper'

export class LoadUserByEmailUseCase {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepositoryInterface
  ) {}

  async find (email: string): Promise<UserResponse> {
    const user = await this.findUserByEmailRepository.find(email)
    return buildUserResponse(user)
  }
}
