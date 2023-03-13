import { CreateUserDto } from '@app/dto/create-user.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { UserResponse } from './types/user-response.interface';
import { LoginUserDto } from '@app/dto/login-user.dto';
import { compare } from 'bcrypt';
import { env } from '@app/config/env';

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

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (userByEmail) {
      const isValid = await compare(
        loginUserDto.password,
        userByEmail.password,
      );

      delete userByEmail.password; // so we don't send the user's password to the frontend
      if (isValid) return userByEmail;
    }

    throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
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

  async getUserByToken(token: string): Promise<UserEntity> {
    const userInToken = verify(token, env.JWT_SECRET) as {
      id: number;
      username: string;
      email: string;
    };

    const user = await this.userRepository.findOne({
      where: {
        id: userInToken.id,
      },
    });
    return user;
  }
}
