import { FollowEntity } from '../follow.entity'

export interface FindAllFollowingsRepositoryInterface {
  findAll: (userId: number) => Promise<FollowEntity[]>
}
