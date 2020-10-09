import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../modules/auth/entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const admin: User = req.user;
    if (admin) {
      const hasRole = () => admin.claims.some(role => role === UserRole.SUPER_ADMIN || UserRole.WEAK_ADMIN);
      return hasRole();
    } else {
      return false;
    }

  }
}
