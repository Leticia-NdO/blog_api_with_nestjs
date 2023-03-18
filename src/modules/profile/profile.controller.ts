import { Controller, Get, Param } from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profile-response.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') userId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(username, userId);
    return this.profileService.buildProfileResponse(profile);
  }
}
