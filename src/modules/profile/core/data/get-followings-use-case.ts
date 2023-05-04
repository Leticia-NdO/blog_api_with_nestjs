import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Repository, In } from 'typeorm'
import { ProfileBulkResponseInterface } from '../../types/profile-bulk-response.interface'
import { FollowEntity } from '../domain/follow.entity'

export class GetFollowingUseCase {
  constructor (
    private readonly userRepository: Repository<UserEntity>,
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getFollowings (userId: number): Promise<ProfileBulkResponseInterface> {
    const follow = await this.followRepository.find({
      where: {
        followerId: userId
      }
    })

    const followingIds = follow.map((foll) => foll.followingId)

    const profiles = await this.userRepository.find({
      where: {
        id: In(followingIds)
      }
    })
    return { profiles }
  }
}
