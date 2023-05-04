import { Repository } from 'typeorm'
import { FindUserByEmailRepositoryInterface } from '../../../domain/repository/find-user-by-email-repository-interface'
import { UserEntity } from '../../../domain/user.entity'

export class FindUserByEmailTypeormRepository
implements FindUserByEmailRepositoryInterface {
  constructor (private readonly userRepository: Repository<UserEntity>) {}

  async find (email: string): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email
      },
      select: ['id', 'username', 'email', 'bio', 'image', 'password']
    })

    return userByEmail
  }
}
