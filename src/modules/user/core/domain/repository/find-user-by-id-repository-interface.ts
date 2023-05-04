import { UserEntity } from '../user.entity'

export interface FindUserByIdRepositoryInterface {
  find: (id: number) => Promise<UserEntity>
}
