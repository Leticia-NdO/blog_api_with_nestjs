import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { FollowEntity } from './follow.entity';
import { ProfileBulkResponseInterface } from './types/profile-bulk-response.interface';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { Profile } from './types/profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}
  async getProfile(username: string, userId: number): Promise<Profile> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!username)
      throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);

    const follow = await this.followRepository.findOne({
      where: {
        followingId: profile.id,
        followerId: userId,
      },
    });

    return {
      ...profile,
      following: !!follow,
    };
  }

  async getFollowings(userId: number): Promise<UserEntity[]> {
    const follow = await this.followRepository.find({
      where: {
        followerId: userId,
      },
    });

    const followingIds = follow.map((foll) => foll.followingId);

    const profiles = await this.userRepository.find({
      where: {
        id: In(followingIds),
      },
    });

    return profiles;
  }

  async followProfile(username: string, userId: number): Promise<Profile> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!username)
      throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);

    if (userId === profile.id)
      throw new HttpException(
        'Follower and Following must be different',
        HttpStatus.NOT_FOUND,
      );
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profile.id,
      },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = userId;
      followToCreate.followingId = profile.id;
      await this.followRepository.save(followToCreate);
    }

    return {
      ...profile,
      following: true,
    };
  }

  async unfollowProfile(username: string, userId: number): Promise<Profile> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!username)
      throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);

    if (userId === profile.id)
      throw new HttpException(
        'Unfollower and Unfollowing must be different',
        HttpStatus.NOT_FOUND,
      );
    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: profile.id,
      },
    });

    if (follow) {
      await this.followRepository.delete(follow.id);
    }

    return {
      ...profile,
      following: false,
    };
  }

  buildProfileResponse(profile: Profile): ProfileResponseInterface {
    delete profile.email;
    return {
      profile,
    };
  }

  buildProfileBulkResponse(
    followings: UserEntity[],
  ): ProfileBulkResponseInterface {
    followings.forEach((prof) => delete prof.email);
    return {
      profiles: followings,
    };
  }
}
