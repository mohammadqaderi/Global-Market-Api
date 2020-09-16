import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { OrderService } from './order.service';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { OrderDto } from './dto/order.dto';


@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Get('all')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.USER)
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get('user')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
  getUserOrders(@GetAuthenticatedUser() user: User) {
    return this.orderService.getUserOrders(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles(Role.USER)
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id/update')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
  updateOrder(@Param('id', ParseIntPipe) id: number,
              @Body() updateOrderDto: OrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id/cancel')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
