import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CartService } from './cart.service';


@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {
  }

  @Post('create-user-cart')
  @UseGuards(AuthGuard(), UserAuthGuard)
  createUserCart(@GetAuthenticatedUser() user: User) {
    return this.cartService.createCart(user);
  }

  @Get('user-cart')
  @UseGuards(AuthGuard(), UserAuthGuard)
  getUserCart(@GetAuthenticatedUser() user: User) {
    return this.cartService.getUserCart(user);
  }
}
