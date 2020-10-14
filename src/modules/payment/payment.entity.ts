import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '../../commons/enums/payment-method.enum';
import { User } from '../auth/entities/user.entity';
import { Invoice } from '../invoice/invoice.entity';


@Entity('payments')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: new Date(Date.now()),
  })
  date: Date;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ManyToOne(type => User, user => user.payments, {
    eager: false,
  })
  user: User;

  @OneToOne(type => Invoice, invoice => invoice.payment, {
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
