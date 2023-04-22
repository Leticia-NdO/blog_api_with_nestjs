import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserResponse } from "../../types/user-response.interface";
import { FindUserByIdRepositoryInterface } from "../domain/repository/find-user-by-id-repository-interface";
import { UpdateUserRepositoryInterface } from "../domain/repository/update-user-repository-interface";
import { buildUserResponse } from "./helpers/user-response-helper";

export class UpdateUser {

  constructor(private readonly updateUserRepository: UpdateUserRepositoryInterface, private readonly loadUserByIdRepository: FindUserByIdRepositoryInterface){}

  async update (userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    await this.updateUserRepository.update(updateUserDto, userId)

    const updatedUser = await this.loadUserByIdRepository.find(userId)

    return buildUserResponse(updatedUser)
  }
}