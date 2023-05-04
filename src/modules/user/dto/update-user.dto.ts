import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDto {
  readonly username: string

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  readonly email: string

  @IsOptional()
  readonly image: string

  @IsOptional()
  readonly bio: string
}
