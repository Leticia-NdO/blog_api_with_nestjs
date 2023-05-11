import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({ example: 'foo@email.com', description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '123', description: 'The password of the user' })
  @IsNotEmpty()
  readonly password: string
}

export class LoginUserRequest {
  @ApiProperty({ type: LoginUserDto })
    user: LoginUserDto
}
