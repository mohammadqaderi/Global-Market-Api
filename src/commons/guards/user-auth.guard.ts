import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../modules/auth/entities/user.entity';
import { ThrowErrors } from '../functions/throw-errors';
import NotAuthorized = ThrowErrors.NotAuthorized;
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (user) {
      const hasRole = () => user.claims.some(role => role === UserRole.USER);
      return hasRole();
    } else {
      NotAuthorized();
      return false;
    }
  }

}
