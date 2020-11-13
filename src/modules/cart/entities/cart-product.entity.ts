import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractProduct } from '../../../commons/classes/abstract-product';
import { Cart } from './cart.entity';

@Entity('cart-product')
export class CartProduct extends AbstractProduct {

  @Column()
  image: string;

  @ManyToOne(type => Cart, cart => cart.cartProducts, {
    eager: false,
  })
  cart: Cart;

  @Column('float', {
    default: 0.0,
  })
  totalPrice: number;

  @Column('int', {
    nullable: true,
  })
  maxPush: number;

  @Column()
  cartId: number;

  @Column()
  productId: number;
}
