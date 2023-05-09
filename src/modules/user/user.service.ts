import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { verify } from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { UserEntity } from './core/domain/user.entity'
import { UserType } from './types/user.type'

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async loadUserByToken (token: string): Promise<UserEntity> {
    const userAccount = verify(token, process.env.JWT_SECRET) as UserType
    if (userAccount) {
      const user = await this.userRepository.findOne({
        where: {
          id: userAccount.id
        }
      })

      return user
    }
  }
}
