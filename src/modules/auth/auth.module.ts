import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailVerification } from './entities/email-verification.entity';
import { JwtStrategy } from './stratigies/jwt-strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { ProfileModule } from '../profile/profile.module';
import { EmailModule } from '../../shared/modules/email/email.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    JwtModule.register({
      secret: AuthConstants.secretKey,
      signOptions: {
        expiresIn: AuthConstants.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository, EmailVerification, ForgottenPassword]),
    ProfileModule,
    EmailModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {
}
