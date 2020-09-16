import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../../../commons/enums/order-status.enum';
import { User } from '../../auth/entities/user.entity';
import { Invoice } from '../../invoice/invoice.entity';
import { OrderItem } from './order-item.entity';
import { BillingAddress } from '../../../commons/classes/billing-address';


@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column()
  comments: string;

  @Column('simple-json')
  address: BillingAddress;

  @Column()
  shipmentDate: Date;

  @ManyToOne(type => User, user => user.orders, {
    eager: false,
  })
  user: User;

  @OneToMany(type => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    eager: true,
  })
  orderItems: OrderItem[];

  @OneToOne(type => Invoice, invoice => invoice.order, {
    eager: true,
  })
  @JoinColumn()
  invoice: Invoice;

  @Column()
  userId: number;

  @Column({
    nullable: true,
  })
  invoiceId: number;
}
