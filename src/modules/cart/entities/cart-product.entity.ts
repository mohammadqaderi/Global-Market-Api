import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractProduct } from '../../../commons/classes/abstract-product';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity';


@Entity('cart-product')
export class CartProduct extends AbstractProduct {

  @Column()
  image: string;

  @ManyToOne(type => Cart, cart => cart.cartProducts, {
    eager: false,
  })
  cart: Cart;

  @ManyToOne(type => Product, product => product.cartProducts, {
    eager: false,
  })
  product: Product;

  @Column()
  cartId: number;

  @Column()
  productId: number;
}
