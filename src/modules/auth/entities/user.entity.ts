import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from '../../profile/profile.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Invoice } from '../../invoice/invoice.entity';
import { Payment } from '../../payment/payment.entity';
import { Order } from '../../order/entities/order.entity';
import { UserRole } from '../../../commons/enums/user-role.enum';
import { Subscriber } from '../../notification/entities/subscriber.entity';

@Entity('users')
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    nullable: true,
  })
  claims: UserRole[];


  // new column
  @Column({
    default: false,
  })
  emailVerified: boolean;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @OneToOne(type => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToOne(type => Cart, cart => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(type => Invoice, invoice => invoice.user, {
    eager: true,
  })
  invoices: Invoice[];

  @OneToMany(type => Payment, payment => payment.user, {
    eager: true,
  })
  payments: Payment[];

  @OneToMany(type => Order, order => order.user, {
    eager: true,
  })
  orders: Order[];

  @Column({
    nullable: true,
  })
  profileId: number;

  @Column({
    nullable: true,
  })
  cartId: number;


  @OneToOne(type => Subscriber, subscriber => subscriber.user)
  @JoinColumn()
  subscriber: Subscriber;

  @Column({
    nullable: true,
  })
  subscriberId: number;


  @Column({
    nullable: true,
  })
  stripeId: string;

}
