import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart-product.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    })],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {

}
