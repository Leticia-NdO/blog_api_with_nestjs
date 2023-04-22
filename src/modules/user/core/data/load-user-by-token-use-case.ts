import { verify } from 'jsonwebtoken';
import { UserResponse } from '../../types/user-response.interface';
import { UserType } from '../../types/user.type';
import { FindUserByIdRepositoryInterface } from '../domain/repository/find-user-by-id-repository-interface';
import { buildUserResponse } from './helpers/user-response-helper';

export class LoadUserByTokenUseCase {
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepositoryInterface
  ) {}

  async find (token: string): Promise<UserResponse> {
    const userAccount = verify(token, process.env.JWT_SECRET) as UserType;
    if (userAccount) {
      const userByToken = await this.findUserByIdRepository.find(userAccount.id)
      return buildUserResponse(userByToken)
    }
  }
}
