import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductModule } from '../product/product.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), OrderModule, PaymentModule, forwardRef(() => ProductModule)],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {

}
