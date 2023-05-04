import { CreateUserDto } from '@app/modules/user/dto/create-user.dto'
import { Repository } from 'typeorm'
import { CreateUserRepositoryInterface } from '../../../domain/repository/create-user-repository-interface'
import { UserEntity } from '../../../domain/user.entity'

export class CreateUserTypeormRepository
implements CreateUserRepositoryInterface {
  constructor (private readonly userRepository: Repository<UserEntity>) {}

  async create (userToBeCreated: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity()
    Object.assign(newUser, userToBeCreated)
    return await this.userRepository.save(newUser)
  }
}
