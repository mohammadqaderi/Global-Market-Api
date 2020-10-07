import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductModule } from '../product/product.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PaymentModule } from '../payment/payment.module';


@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), ProductModule, forwardRef(() => InvoiceModule), PaymentModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})

export class OrderModule {

}
