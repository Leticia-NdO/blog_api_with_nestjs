import { LoginUserDto } from "../../dto/login-user.dto";
import { UserResponse } from "../../types/user-response.interface";
import { FindUserByEmailRepositoryInterface } from "../domain/repository/find-user-by-email-repository-interface";
import { compare } from 'bcrypt';
import { buildUserResponse } from "./helpers/user-response-helper";

export class LoginUser {
  constructor(private readonly findUserByEmailRepository: FindUserByEmailRepositoryInterface){}

  async login (loginUserDto: LoginUserDto): Promise<UserResponse> {
    const userByEmail = await this.findUserByEmailRepository.find(loginUserDto.email)

    if (userByEmail) {
      const isValid = await compare(
        loginUserDto.password,
        userByEmail.password,
      );

      delete userByEmail.password; // so we don't send the user's password to the frontend
      if (isValid) return buildUserResponse(userByEmail);
    }
  }
}