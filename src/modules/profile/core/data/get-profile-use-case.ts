import { FindUserByIdRepositoryInterface } from '@app/modules/user/core/domain/repository/find-user-by-id-repository-interface'
import { ProfileResponseInterface } from '../../types/profile-response.interface'
import { FindOneFollowRepositoryInterface } from '../domain/repository/find-one-follow-repository-interface'
import { buildProfileResponse } from './helpers/profile-response-helper'

export class GetProfileUseCase {
  constructor (
    private readonly findUserByIdRepository: FindUserByIdRepositoryInterface,
    private readonly findOneFollowRepository: FindOneFollowRepositoryInterface
  ) {}

  async getProfile (userToBeViewedId: number, currentUserId: number): Promise<ProfileResponseInterface> {
    const profile = await this.findUserByIdRepository.find(userToBeViewedId)

    const follow = await this.findOneFollowRepository.find(currentUserId, userToBeViewedId)

    return buildProfileResponse({
      ...profile,
      following: !!follow
    })
  }
}
