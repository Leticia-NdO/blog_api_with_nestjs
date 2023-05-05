import { Repository } from 'typeorm'
import { FollowEntity } from '../../../domain/follow.entity'
import { FindAllFollowingsRepositoryInterface } from '../../../domain/repository/find-all-followings-repository-interface'
import { FindOneFollowRepositoryInterface } from '../../../domain/repository/find-one-follow-repository-interface'
import { FollowProfileRepositoryInterface } from '../../../domain/repository/follow-profile-repository-interface'
import { UnfollowProfileRepositoryInterface } from '../../../domain/repository/unfollow-profile-repository-interface'

export class FollowTypeormRepository implements
  FindAllFollowingsRepositoryInterface,
  FindOneFollowRepositoryInterface,
  FollowProfileRepositoryInterface,
  UnfollowProfileRepositoryInterface {
  constructor (private readonly followRepository: Repository<FollowEntity>) {}

  async findAllFollowings (userId: number): Promise<FollowEntity[]> {
    const follow = await this.followRepository.find({
      where: {
        followerId: userId
      }
    })

    return follow
  }

  async findOne (userId: number, profileToBeFoundId: number): Promise<FollowEntity> {
    const follow = await this.followRepository.findOne({
      where: {
        followingId: profileToBeFoundId,
        followerId: userId
      }
    })

    return follow
  }

  async findAll (userId: number): Promise<FollowEntity[]> {
    const follows = await this.followRepository.find({
      where: {
        followerId: userId
      }
    })

    return follows
  }

  async follow (userId: number, profileToBeFollowedId: number): Promise<void> {
    const followToCreate = new FollowEntity()
    followToCreate.followerId = userId
    followToCreate.followingId = profileToBeFollowedId
    await this.followRepository.save(followToCreate)
  }

  async unfollow (userId: number, profileToBeUnfollowedId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profileToBeUnfollowedId
      }
    })

    if (follow) {
      await this.followRepository.delete(follow.id)
    }
  }
}
