import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Profile } from '../../types/profile.interface'
import { FindOneFollowRepositoryInterface } from '../domain/repository/find-one-follow-repository-interface'
import { FollowProfileRepositoryInterface } from '../domain/repository/follow-profile-repository-interface'

export class FollowProfileUseCase {
  constructor (
    private readonly findOneFollowRepository: FindOneFollowRepositoryInterface,
    private readonly followProfileRepository: FollowProfileRepositoryInterface
  ) {}

  async followProfile (profileToBeFollowed: UserEntity, userId: number): Promise<Profile> {
    const follow = await this.findOneFollowRepository.find(userId, profileToBeFollowed.id)

    if (!follow) {
      await this.followProfileRepository.follow(userId, profileToBeFollowed.id)
    }

    return {
      ...profileToBeFollowed,
      following: true
    }
  }
}
