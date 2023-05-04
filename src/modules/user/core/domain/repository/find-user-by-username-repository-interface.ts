import { UserEntity } from '../user.entity'

export interface FindUserByUsernameRepositoryInterface {
  find: (username: string) => Promise<UserEntity>
}
