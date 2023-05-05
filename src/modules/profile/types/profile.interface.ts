import { UserType } from '@app/modules/user/types/user.type'

export interface Profile extends UserType {
  following: boolean
}
