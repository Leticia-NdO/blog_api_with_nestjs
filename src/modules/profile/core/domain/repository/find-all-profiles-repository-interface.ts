import { UserEntity } from '@app/modules/user/core/domain/user.entity'

export interface FindAllProfilesRepositoryInterface {
  find: (ids?: number[]) => Promise<UserEntity[]>
}
