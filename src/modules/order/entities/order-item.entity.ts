import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';


@Entity('order-item')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unitPrice: number;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @ManyToOne(type => Order, order => order.orderItems, {
    eager: false,
  })
  order: Order;

  @Column()
  orderId: number;

  @Column()
  productId: number;
}
