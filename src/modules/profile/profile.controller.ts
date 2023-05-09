import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards
} from '@nestjs/common'
import { LoadUserByUsernameUseCase } from '../user/core/data/load-user-by-username-use-case'
import { User } from '../user/decorators/user.decorator'
import { AuthGuard } from '../user/guards/auth.guard'
import { FollowProfileUseCase } from './core/data/follow-profile-use-case'
import { GetFollowingsUseCase } from './core/data/get-followings-use-case'
import { GetProfileUseCase } from './core/data/get-profile-use-case'
import { UnfollowProfileUseCase } from './core/data/unfollow-profile-use-case'
import { ProfileBulkResponseInterface } from './types/profile-bulk-response.interface'
import { ProfileResponseInterface } from './types/profile-response.interface'

@Controller('profiles')
export class ProfileController {
  constructor (
    private readonly getFollowingsUseCase: GetFollowingsUseCase,
    private readonly loadUserByUsernameUseCase: LoadUserByUsernameUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly followProfileUseCase: FollowProfileUseCase,
    private readonly unollowProfileUseCase: UnfollowProfileUseCase
  ) {}

  @Get('following')
  @UseGuards(AuthGuard)
  async getFollowings (
    @User('id') userId: number
  ): Promise<ProfileBulkResponseInterface> {
    // Return all profiles followed by the user
    return await this.getFollowingsUseCase.get(userId)
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  async getProfile (
    @Param('username') username: string,
      @User('id') userId: number
  ): Promise<ProfileResponseInterface> {
    // Return user's profile
    const userToBeViewed = await this.loadUserByUsernameUseCase.find(username)

    if (!userToBeViewed) throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND)

    return await this.getProfileUseCase.getProfile(userToBeViewed.user.id, userId)
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile (
    @Param('username') username: string,
      @User('id') userId: number
  ): Promise<ProfileResponseInterface> {
    // Fazer essas checagens aqui com o load user by username use case
    const userToBeFollowed = await this.loadUserByUsernameUseCase.find(username)

    if (!userToBeFollowed) throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND)
    if (userId === userToBeFollowed.user.id) {
      throw new HttpException(
        'Follower and Following must be different',
        HttpStatus.NOT_FOUND
      )
    }
    // Follow another profile
    return await this.followProfileUseCase.followProfile(userToBeFollowed.user, userId)
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile (
    @Param('username') username: string,
      @User('id') userId: number
  ): Promise<ProfileResponseInterface> {
    const userToBeUnfollowed = await this.loadUserByUsernameUseCase.find(username)

    if (!userToBeUnfollowed) throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND)

    if (userId === userToBeUnfollowed.user.id) {
      throw new HttpException(
        'Follower and Following must be different',
        HttpStatus.NOT_FOUND
      )
    }
    // Unfollow another profile
    return await this.unollowProfileUseCase.unfollowProfile(userToBeUnfollowed.user, userId)
  }
}
