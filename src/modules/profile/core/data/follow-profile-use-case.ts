import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Repository } from 'typeorm'
import { Profile } from '../../types/profile.interface'
import { FollowEntity } from '../domain/follow.entity'

export class FollowProfileUseCase {
  constructor (
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async followProfile (profileToBeFollowed: UserEntity, userId: number): Promise<Profile> {
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profileToBeFollowed.id
      }
    })

    if (!follow) {
      const followToCreate = new FollowEntity()
      followToCreate.followerId = userId
      followToCreate.followingId = profileToBeFollowed.id
      await this.followRepository.save(followToCreate)
    }

    return {
      ...profileToBeFollowed,
      following: true
    }
  }
}
