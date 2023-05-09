import { UserType } from '@app/modules/user/types/user.type'
import { ProfileResponseInterface } from '../../types/profile-response.interface'
import { FindOneFollowRepositoryInterface } from '../domain/repository/find-one-follow-repository-interface'
import { FollowProfileRepositoryInterface } from '../domain/repository/follow-profile-repository-interface'
import { buildProfileResponse } from './helpers/profile-response-helper'

export class FollowProfileUseCase {
  constructor (
    private readonly findOneFollowRepository: FindOneFollowRepositoryInterface,
    private readonly followProfileRepository: FollowProfileRepositoryInterface
  ) {}

  async followProfile (profileToBeFollowed: UserType, userId: number): Promise<ProfileResponseInterface> {
    const follow = await this.findOneFollowRepository.findOne(userId, profileToBeFollowed.id)

    if (!follow) {
      await this.followProfileRepository.follow(userId, profileToBeFollowed.id)
    }

    return buildProfileResponse({
      ...profileToBeFollowed,
      following: true
    })
  }
}
