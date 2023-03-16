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
import { UserType } from './types/user.type';
import { UpdateUserDto } from '@app/dto/update-user.dto';

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

  async loadUserByToken(token: string): Promise<UserEntity> {
    const userAccount = verify(token, env.JWT_SECRET) as UserType;
    if (userAccount) {
      const userByToken = await this.userRepository.findOne({
        where: {
          id: userAccount.id,
        },
      });

      return userByToken;
    }

    throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    if (updateUserDto.email) {
      const emailExists = await this.loadUserByEmail(updateUserDto.email);
      if (emailExists && emailExists.id !== userId) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }

    if (updateUserDto.username) {
      const usernameExists = await this.loadUserByEmail(updateUserDto.username);
      if (usernameExists && usernameExists.id !== userId) {
        throw new HttpException('Username already in use', HttpStatus.CONFLICT);
      }
    }

    await this.userRepository.update(
      {
        id: userId,
      },
      updateUserDto,
    );

    const updatedUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return updatedUser;
  }

  async loadUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async loadUserUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    return user;
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
