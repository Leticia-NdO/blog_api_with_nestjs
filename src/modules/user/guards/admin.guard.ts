import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common'

export class AdminGuard implements CanActivate {
  canActivate (context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    if (request.user.role === 'admin') return true

    throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED)
  }
}
