import { UpdateUserDto } from '@app/modules/user/dto/update-user.dto'
import { Repository } from 'typeorm'
import { UpdateUserRepositoryInterface } from '../../../domain/repository/update-user-repository-interface'
import { UserEntity } from '../../../domain/user.entity'

export class UpdateUserTypeormRepository implements UpdateUserRepositoryInterface {
  constructor (private readonly userRepository: Repository<UserEntity>) {}

  async update (updateUserDto: UpdateUserDto, id: number): Promise<UserEntity> {
    await this.userRepository.update(
      {
        id
      },
      updateUserDto
    )

    const updatedUser = await this.userRepository.findOne({
      where: {
        id
      }
    })

    return updatedUser
  }
}
