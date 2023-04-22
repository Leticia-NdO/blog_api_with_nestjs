import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { UserEntity } from '../user.entity';

export interface CreateUserRepositoryInterface {
  create: (userToBeCreated: CreateUserDto) => Promise<UserEntity>;
}
