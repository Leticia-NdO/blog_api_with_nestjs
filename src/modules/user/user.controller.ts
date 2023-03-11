import { CreateUserDto } from '@app/dto/create-user-dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserResponse } from './types/user-response.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    const userEntity = await this.userService.createUser(createUserDto);
    return await this.userService.buildUserResponse(userEntity);
  }
}
