import { UserEntity } from '@app/modules/user/core/domain/user.entity';
import { Request } from 'express';
export interface ExpressRequest extends Request {
  user: UserEntity;
}
