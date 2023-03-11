import { CreateUserDto } from '@app/dto/create-user.dto';
import { LoginUserDto } from '@app/dto/login-user.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserResponse } from './types/user-response.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    const userEntity = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(userEntity);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    const userEntity = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(userEntity);
  }
}
