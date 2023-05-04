import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Repository } from 'typeorm'
import { ProfileResponseInterface } from '../../types/profile-response.interface'
import { FollowEntity } from '../domain/follow.entity'
import { buildProfileResponse } from './helpers/profile-response-helper'

export class GetProfileUseCase {
  constructor (
    private readonly userRepository: Repository<UserEntity>,
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getProfile (userToBeViewedId: number, currentUserId: number): Promise<ProfileResponseInterface> {
    const profile = await this.userRepository.findOne({
      where: {
        id: userToBeViewedId
      }
    })

    const follow = await this.followRepository.findOne({
      where: {
        followingId: profile.id,
        followerId: currentUserId
      }
    })

    return buildProfileResponse({
      ...profile,
      following: !!follow
    })
  }
}
