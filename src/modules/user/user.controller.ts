import { CreateUserDto } from '@app/modules/user/dto/create-user.dto'
import { LoginUserDto } from '@app/modules/user/dto/login-user.dto'
import { UpdateUserDto } from '@app/modules/user/dto/update-user.dto'
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateUserUseCase } from './core/data/create-user-use-case'
import { buildUserResponse } from './core/data/helpers/user-response-helper'
import { LoginUser } from './core/data/login-user-use-case'
import { UpdateUser } from './core/data/update-user-use-case'
import { User } from './decorators/user.decorator'
import { AuthGuard } from './guards/auth.guard'
import { IllegalPasswordAlteration } from './guards/illegal-password-alteration.guard'
import { UserResponse } from './types/user-response.interface'

@Controller('users')
export class UserController {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUser,
    private readonly updateUserUseCase: UpdateUser) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser (
    @Body('user') createUserDto: CreateUserDto
  ): Promise<UserResponse> {
    return await this.createUserUseCase.create(createUserDto)
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login (@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    return await this.loginUseCase.login(loginUserDto)
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  currentUser (@User() user: any): UserResponse {
    return buildUserResponse(user)
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @UseGuards(IllegalPasswordAlteration)
  @UseGuards(AuthGuard)
  async updateUser (
    @Body('user') updateUserDto: UpdateUserDto,
      @User('id') id: number
  ): Promise<UserResponse> {
    return await this.updateUserUseCase.update(id, updateUserDto)
  }
}
