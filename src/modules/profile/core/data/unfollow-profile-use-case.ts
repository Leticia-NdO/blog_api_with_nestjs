import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Profile } from '../../types/profile.interface'
import { FindOneFollowRepositoryInterface } from '../domain/repository/find-one-follow-repository-interface'
import { UnfollowProfileRepositoryInterface } from '../domain/repository/unfollow-profile-repository-interface'

export class UnfollowProfileUseCase {
  constructor (
    private readonly findOneFollowRepository: FindOneFollowRepositoryInterface,
    private readonly unfollowRepository: UnfollowProfileRepositoryInterface
  ) {}

  async unfollowProfile (profileToBeUnfollowed: UserEntity, userId: number): Promise<Profile> {
    const follow = await this.findOneFollowRepository.find(userId, profileToBeUnfollowed.id)

    if (follow) {
      await this.unfollowRepository.unfollow(userId, profileToBeUnfollowed.id)
    }

    return {
      ...profileToBeUnfollowed,
      following: false
    }
  }
}
