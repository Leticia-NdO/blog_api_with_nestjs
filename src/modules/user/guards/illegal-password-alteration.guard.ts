import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Observable } from 'rxjs'

export class IllegalPasswordAlteration implements CanActivate {
  canActivate (
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const body = context.switchToHttp().getRequest().body

    if (body.user.password) { throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED) }

    return true
  }
}
