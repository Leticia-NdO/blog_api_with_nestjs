import { ExpressRequest } from '@app/types/express-request.interface';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }
    try {
      const user = await this.userService.getUserByToken(token);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      }
    } catch (err) {
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }
  }
}
