import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { CartProduct } from './entities/cart-product.entity';


@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
              @InjectRepository(CartProduct) private readonly cartProductRepository: Repository<CartProduct>) {
  }

  async createCart(user: User): Promise<Cart> {
    const cart = new Cart();
    cart.cartProducts = [];
    cart.user = user;
    cart.totalItems = 0;
    const savedCart = await cart.save();
    return savedCart;
  }

  async getUserCart(user?: User, id?: number): Promise<Cart> {
    let cart = null;
    if (user) {
      cart = await this.cartRepository.findOne({
        where: {
          id: user.cartId,
        },
      });
    } else if (id) {
      cart = await this.cartRepository.findOne({
        where: {
          id,
        },
      });
    }
    if (!cart) {
      NotFound('Cart', user.cartId || id);
    }
    return cart;
  }


  async clearCart(id: number) {
    const cart = await this.getUserCart(null, id);
    for (let i = 0; i < cart.cartProducts.length; i++) {
      await this.cartProductRepository.delete(cart.cartProducts[i].id);
    }
    cart.cartProducts = [];
    return await cart.save();
  }

  async removeProductsFromCart(id: number, cartProducts: CartProduct[]): Promise<void> {
    const cart = await this.getUserCart(null, id);
    for (let i = 0; i < cartProducts.length; i++) {
      const isInCart = cart.cartProducts.some(prod => prod.id === cartProducts[i].id);
      if (isInCart) {
        await this.cartProductRepository.delete(cartProducts[i].id);
      }
    }
  }

}
