import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvoiceModule } from '../invoice/invoice.module';


@Module({
  imports: [TypeOrmModule.forFeature([Payment]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), InvoiceModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})

export class PaymentModule {

}
