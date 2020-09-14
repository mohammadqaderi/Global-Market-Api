import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Payment]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    })],
  providers: [PaymentService],
  controllers: [PaymentController],
})

export class PaymentModule {

}
