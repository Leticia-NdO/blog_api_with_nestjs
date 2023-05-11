import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ example: 'foo', description: 'The username of the user' })
  readonly username: string

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({ example: 'http://www.example.com/images/123.png', description: 'The profile image of the user' })
  @IsOptional()
  readonly image: string

  @IsOptional()
  @ApiProperty({ example: '', description: 'The profile bio of the user' })
  readonly bio: string
}

export class UpdateUserRequest {
  @ApiProperty({ type: UpdateUserDto })
    user: UpdateUserDto
}
