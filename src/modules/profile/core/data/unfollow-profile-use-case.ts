import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { ProfileResponseInterface } from '../../types/profile-response.interface'
import { FindOneFollowRepositoryInterface } from '../domain/repository/find-one-follow-repository-interface'
import { UnfollowProfileRepositoryInterface } from '../domain/repository/unfollow-profile-repository-interface'
import { buildProfileResponse } from './helpers/profile-response-helper'

export class UnfollowProfileUseCase {
  constructor (
    private readonly findOneFollowRepository: FindOneFollowRepositoryInterface,
    private readonly unfollowRepository: UnfollowProfileRepositoryInterface
  ) {}

  async unfollowProfile (profileToBeUnfollowed: UserEntity, userId: number): Promise<ProfileResponseInterface> {
    const follow = await this.findOneFollowRepository.findOne(userId, profileToBeUnfollowed.id)

    if (follow) {
      await this.unfollowRepository.unfollow(userId, profileToBeUnfollowed.id)
    }

    return buildProfileResponse({
      ...profileToBeUnfollowed,
      following: false
    })
  }
}
