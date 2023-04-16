import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../user/guards/auth.guard';
import { ProfileService } from './profile.service';
import { ProfileBulkResponseInterface } from './types/profile-bulk-response.interface';
import { ProfileResponseInterface } from './types/profile-response.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('following')
  @UseGuards(AuthGuard)
  async getFollowings(
    @User('id') userId: number,
  ): Promise<ProfileBulkResponseInterface> {
    // Return all user's followers
    const profile = await this.profileService.getFollowings(userId);
    return this.profileService.buildProfileBulkResponse(profile);
  }

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @User('id') userId: number,
  ): Promise<ProfileResponseInterface> {
    // Return user's profile
    const profile = await this.profileService.getProfile(username, userId);
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @Param('username') username: string,
    @User('id') userId: number,
  ): Promise<ProfileResponseInterface> {
    // Follow another profile
    const profile = await this.profileService.followProfile(username, userId);
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @Param('username') username: string,
    @User('id') userId: number,
  ): Promise<ProfileResponseInterface> {
    // Unfollow another profile
    const profile = await this.profileService.unfollowProfile(username, userId);
    return this.profileService.buildProfileResponse(profile);
  }
}
