import { UserEntity } from '@app/modules/user/core/domain/user.entity'

export interface FindAllProfilesRepositoryInterface {
  findAllProfiles: (ids?: number[]) => Promise<UserEntity[]>
}
