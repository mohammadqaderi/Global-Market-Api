import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string = client.handshake.query.Authorization.split(' ')[1];
    return Boolean(token);
  }
}
