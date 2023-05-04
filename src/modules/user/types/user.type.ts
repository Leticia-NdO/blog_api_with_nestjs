import { UserEntity } from '../core/domain/user.entity'

export type UserType = Omit<UserEntity, 'hashPassword'>
