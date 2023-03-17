import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { LoginUserDto } from '@app/modules/user/dto/login-user.dto';
import { UpdateUserDto } from '@app/modules/user/dto/update-user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { IllegalPasswordAlteration } from './guards/illegal-password-alteration.guard';
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

  @Get()
  @UsePipes(new ValidationPipe())
  currentUser(@User() user: any): UserResponse {
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @UseGuards(IllegalPasswordAlteration)
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User('id') id: number,
  ): Promise<UserResponse> {
    const userEntity = await this.userService.updateUser(id, updateUserDto);
    return this.userService.buildUserResponse(userEntity);
  }
}
