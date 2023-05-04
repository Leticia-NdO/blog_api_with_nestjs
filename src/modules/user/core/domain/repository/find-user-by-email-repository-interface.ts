import { UserEntity } from '../user.entity'

export interface FindUserByEmailRepositoryInterface {
  find: (email: string) => Promise<UserEntity>
}
