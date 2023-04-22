import { Repository } from "typeorm";
import { FindUserByIdRepositoryInterface } from "../../../domain/repository/find-user-by-id-repository-interface";
import { UserEntity } from "../../../domain/user.entity";

export class FindUserByIdTypeormRepository implements FindUserByIdRepositoryInterface {
  constructor(private userRepository: Repository<UserEntity>) {}
  async find (id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id
      },
    });

    return user;
  }
}