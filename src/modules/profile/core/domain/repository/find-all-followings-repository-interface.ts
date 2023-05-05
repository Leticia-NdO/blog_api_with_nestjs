import { FollowEntity } from '../follow.entity'

export interface FindAllFollowingsRepositoryInterface {
  find: (userId: number) => Promise<FollowEntity[]>
}
