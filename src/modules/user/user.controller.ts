import { CreateUserDto, CreateUserRequest } from '@app/modules/user/dto/create-user.dto'
import { LoginUserDto, LoginUserRequest } from '@app/modules/user/dto/login-user.dto'
import { UpdateUserDto, UpdateUserRequest } from '@app/modules/user/dto/update-user.dto'
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
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiCreatedResponse, ApiBody, ApiOkResponse, ApiForbiddenResponse, ApiHeader, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUser,
    private readonly updateUserUseCase: UpdateUser) {}

  
  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Creates a user' })
  @ApiCreatedResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: CreateUserRequest })
  /* ------------------------------------------------------- */
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser (
    @Body('user') createUserDto: CreateUserDto
  ): Promise<UserResponse> {
    return await this.createUserUseCase.create(createUserDto)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Login the user' })
  @ApiCreatedResponse({ description: 'Successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: LoginUserRequest })
  /* ------------------------------------------------------- */
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login (@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    return await this.loginUseCase.login(loginUserDto)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Get current user based on authorization token' })
  @ApiOkResponse({ description: 'Successfully got current user' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  currentUser (@User() user: any): UserResponse {
    return buildUserResponse(user)
  }
  
  
  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: `Update user's username, email, bio and image` })
  @ApiOkResponse({ description: 'Successfully updated current user' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiUnauthorizedResponse({ description: 'Forbidden to change password by this means' })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: UpdateUserRequest })
  /* ------------------------------------------------------- */
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
