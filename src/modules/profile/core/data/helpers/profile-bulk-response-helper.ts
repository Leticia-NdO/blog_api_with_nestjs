import { ProfileBulkResponseInterface } from '@app/modules/profile/types/profile-bulk-response.interface'
import { Profile } from '@app/modules/profile/types/profile.interface'

export const buildProfileBulkResponse = (
  profiles: Profile[]
): ProfileBulkResponseInterface => {
  return { profiles }
}
