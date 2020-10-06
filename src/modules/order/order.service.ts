import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from '../../commons/enums/order-status.enum';
import { OrderItem } from './entities/order-item.entity';
import { CartProduct } from '../cart/entities/cart-product.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { ProductService } from '../product/product.service';


@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
              @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
              private productService: ProductService) {
  }

  async getAllOrders(): Promise<Order[]> {
    let orders = await this.orderRepository.find();
    orders = await this.checkOrdersStatus(orders);
    return orders;
  }

  async getTotalOrders() {
    return await this.orderRepository.createQueryBuilder().getCount();
  }

  async checkOrdersStatus(orders: Order[]) {
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].createdAt.getTime() === orders[i].shipmentDate.getTime()) {
        orders[i].status = OrderStatus.SHIPPED;
        await orders[i].save();
      } else if (orders[i].createdAt.getTime() > orders[i].shipmentDate.getTime()) {
        orders[i].status = OrderStatus.DELIVERED;
        await orders[i].save();
      }
    }
    return orders;
  }

  async getOrderItems(orderId: number) {
    const orderItems = await this.orderItemRepository.find({
      where: {
        orderId,
      },
    });
    return orderItems;
  }

  async getUserOrders(user: User): Promise<Order[]> {
    let userOrders = await this.orderRepository.find({
      where: {
        userId: user,
      },
    });
    userOrders = await this.checkOrdersStatus(userOrders);
    return userOrders;
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
    });
    if (!order) {
      NotFound('Order', id);
    }
    return order;
  }

  async createOrder(
    user: User,
    createOrderDto: OrderDto,
  ): Promise<Order> {
    const order = new Order();
    const { comments, billingAddress } = createOrderDto;
    order.comments = comments;
    order.user = user;
    const today = new Date();
    order.orderItems = [];
    order.status = OrderStatus.PROCESSED;
    order.address = billingAddress;
    order.shipmentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const savedOrder = await order.save();
    return savedOrder;
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    for (let i = 0; i < order.orderItems.length; i++) {
      await this.orderItemRepository.delete(order.orderItems[i].id);
    }
    const result = await this.orderRepository.delete(order.id);
    if (result.affected === 0) {
      NotFound('Order', id);
    }
  }

  async updateOrder(id: number, updateOrderDto: OrderDto): Promise<Order> {
    const order = await this.getOrderById(id);
    const { comments, billingAddress } = updateOrderDto;
    if (comments) {
      order.comments = comments;
    }
    if (billingAddress) {
      order.address = billingAddress;
    }
    order.updatedAt = new Date();
    const updatedOrder = await order.save();
    return updatedOrder;
  }

  async createOrderItem(order: Order, cartProduct: CartProduct): Promise<OrderItem> {
    const product = await this.productService.getProductById(cartProduct.productId);
    product.sales += 1;
    product.quantity = product.quantity - cartProduct.quantity;
    await product.save();
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.productId = cartProduct.productId;
    orderItem.unitPrice = cartProduct.totalPrice;
    orderItem.quantity = cartProduct.quantity;
    const savedOrderItem = await orderItem.save();
    return savedOrderItem;
  }
}
