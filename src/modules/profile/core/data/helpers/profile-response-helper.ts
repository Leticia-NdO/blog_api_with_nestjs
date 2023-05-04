import { ProfileResponseInterface } from '@app/modules/profile/types/profile-response.interface'
import { Profile } from '@app/modules/profile/types/profile.interface'

export const buildProfileResponse = (
  profile: Profile
): ProfileResponseInterface => {
  return { profile }
}
