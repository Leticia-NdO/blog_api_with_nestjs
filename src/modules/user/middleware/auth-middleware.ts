import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '@app/types/express-request.interface';
import { UserService } from '../user.service';
// without next we won't go inside our controller
@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    try {
      const user = await this.userService.loadUserByToken(token);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }
  }
}
