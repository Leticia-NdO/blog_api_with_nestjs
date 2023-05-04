import { Repository } from 'typeorm'
import { FindUserByUsernameRepositoryInterface } from '../../../domain/repository/find-user-by-username-repository-interface'
import { UserEntity } from '../../../domain/user.entity'

export class FindUserByUsernameTypeormRepository implements FindUserByUsernameRepositoryInterface {
  constructor (private readonly userRepository: Repository<UserEntity>) {}
  async find (username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username
      }
    })

    return user
  }
}
