import { FollowEntity } from '../follow.entity'

export interface FindOneFollowRepositoryInterface {
  find: (userId: number, profileToBeFollowedId: number) => Promise<FollowEntity>
}
