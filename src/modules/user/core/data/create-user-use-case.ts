import { CreateUserDto } from '../../dto/create-user.dto'
import { UserResponse } from '../../types/user-response.interface'
import { CreateUserRepositoryInterface } from '../domain/repository/create-user-repository-interface'
import { buildUserResponse } from './helpers/user-response-helper'

export class CreateUserUseCase {
  constructor (
    private readonly createRepository: CreateUserRepositoryInterface
  ) {}

  async create (userToBeCreated: CreateUserDto): Promise<UserResponse> {
    const user = await this.createRepository.create(userToBeCreated)
    return buildUserResponse(user)
  }
}
