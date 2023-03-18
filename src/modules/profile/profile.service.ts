import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProfileResponseInterface } from './types/profile-response.interface';
import { Profile } from './types/profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getProfile(username: string, userId: number): Promise<Profile> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
    });

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
}
