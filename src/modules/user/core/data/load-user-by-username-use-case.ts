import { UserResponse } from '../../types/user-response.interface';
import { FindUserByUsernameRepositoryInterface } from '../domain/repository/find-user-by-username-repository-interface';
import { buildUserResponse } from './helpers/user-response-helper';

export class LoadUserByUsernameUseCase {
  constructor(
    private readonly findUserByUsernameRepository: FindUserByUsernameRepositoryInterface
  ) {}

  async find (username: string): Promise<UserResponse> {
    const userByToken = await this.findUserByUsernameRepository.find(username)
    return buildUserResponse(userByToken)
  }
}
