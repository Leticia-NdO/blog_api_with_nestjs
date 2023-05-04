import { UserResponse } from '@app/modules/user/types/user-response.interface'
import { UserEntity } from '../../domain/user.entity'
import { generateToken } from '../../infra/encrypt/generate-token'

export const buildUserResponse = (userEntity: UserEntity): UserResponse => {
  const token = generateToken(userEntity)
  return {
    user: {
      ...userEntity,
      token
    }
  }
}
