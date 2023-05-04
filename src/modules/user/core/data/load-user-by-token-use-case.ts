import { verify } from 'jsonwebtoken'
import { UserType } from '../../types/user.type'
import { FindUserByIdRepositoryInterface } from '../domain/repository/find-user-by-id-repository-interface'
import { UserEntity } from '../domain/user.entity'

export class LoadUserByTokenUseCase {
  constructor (
    private readonly findUserByIdRepository: FindUserByIdRepositoryInterface
  ) {}

  async find (token: string): Promise<UserEntity> {
    const userAccount = verify(token, process.env.JWT_SECRET) as UserType
    if (userAccount) {
      return await this.findUserByIdRepository.find(userAccount.id)
    }
  }
}
