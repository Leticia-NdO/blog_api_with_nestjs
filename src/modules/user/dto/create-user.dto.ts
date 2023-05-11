import { IsNotEmpty, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'foo', description: 'The username of the user' })
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({ example: 'foo@email.com', description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '123', description: 'The password of the user' })
  @IsNotEmpty()
  readonly password: string
}

export class CreateUserRequest {
  @ApiProperty({ type: CreateUserDto })
    user: CreateUserDto
}
