import { BaseEntity, Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Payment } from '../payment/payment.entity';


@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  number: string;

  @Column()
  total: number;

  @Column({
    default: new Date(),
  })
  date: Date;

  @Column()
  dueDate: Date;

  @Column()
  paymentDate: Date;

  @OneToOne(type => Order, order => order.invoice)
  order: Order;

  @OneToOne(type => Payment, payment => payment.invoice)
  payment: Payment;

  @ManyToOne(type => User, user => user.invoices, {
    eager: false,
  })
  user: User;

  @Column()
  userId: number;

}
