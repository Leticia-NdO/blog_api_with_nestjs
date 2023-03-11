import { CreateUserDto } from '@app/dto/create-user-dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  buildUserResponse(userEntity: UserEntity): UserResponse {
    const token = this.generateToken(userEntity);
    return {
      user: {
        ...userEntity,
        token,
      },
    };
  }

  generateToken(userEntity: UserEntity): string {
    return sign(
      {
        id: userEntity.id,
        username: userEntity.username,
        email: userEntity.email,
      },
      'secret',
    );
  }
}
