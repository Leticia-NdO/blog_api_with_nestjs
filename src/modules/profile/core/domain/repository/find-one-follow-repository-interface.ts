import { FollowEntity } from '../follow.entity'

export interface FindOneFollowRepositoryInterface {
  findOne: (userId: number, profileToBeFoundId: number) => Promise<FollowEntity>
}
