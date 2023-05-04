import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Repository } from 'typeorm'
import { Profile } from '../../types/profile.interface'
import { FollowEntity } from '../domain/follow.entity'

export class UnfollowProfileUseCase {
  constructor (
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async unfollowProfile (profileToBeUnfollowed: UserEntity, userId: number): Promise<Profile> {
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profileToBeUnfollowed.id
      }
    })

    if (follow) {
      await this.followRepository.delete(follow.id)
    }

    return {
      ...profileToBeUnfollowed,
      following: false
    }
  }
}
