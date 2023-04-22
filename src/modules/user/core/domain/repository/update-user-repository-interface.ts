import { UpdateUserDto } from '@app/modules/user/dto/update-user.dto';
import { UserEntity } from '../user.entity';

export interface UpdateUserRepositoryInterface {
  update: (updateUserDto: UpdateUserDto, id: number) => Promise<UserEntity>;
}
