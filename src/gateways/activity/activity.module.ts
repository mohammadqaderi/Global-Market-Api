import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { ActivityController } from './activity.controller';
import { ActivityGateway } from './activity.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from './activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityRepository]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [ActivityController],
  providers: [ActivityGateway],
})
export class ActivityModule {

}
