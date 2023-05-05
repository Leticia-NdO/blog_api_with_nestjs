import { ProfileBulkResponseInterface } from '../../types/profile-bulk-response.interface'
import { FindAllFollowingsRepositoryInterface } from '../domain/repository/find-all-followings-repository-interface'
import { FindAllProfilesRepositoryInterface } from '../domain/repository/find-all-profiles-repository-interface'
import { buildProfileBulkResponse } from './helpers/profile-bulk-response-helper'

export class GetFollowingsUseCase {
  constructor (
    private readonly findAllFollowingsRepositoryInterface: FindAllFollowingsRepositoryInterface,
    private readonly findAllProfilesRepositoryInterface: FindAllProfilesRepositoryInterface
  ) {}

  async get (userId: number): Promise<ProfileBulkResponseInterface> {
    const follow = await this.findAllFollowingsRepositoryInterface.findAll(userId)

    const followingIds = follow.map((foll) => foll.followingId)

    const profiles = await this.findAllProfilesRepositoryInterface.find(followingIds)

    return buildProfileBulkResponse(profiles.map((prof) => {
      return {
        ...prof,
        following: true
      }
    }))
  }
}
