import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartProduct } from './cart-product.entity';
import { User } from '../../auth/entities/user.entity';


@Entity('cart')
export class Cart extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(type => User, user => user.cart)
  user: User;

  @Column({
    default: 0,
  })
  totalItems: number;

  @OneToMany(type => CartProduct, cartProduct => cartProduct.cart, {
    eager: true,
  })
  cartProducts: CartProduct[];
}
