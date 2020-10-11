import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Key } from '../classes/key';
import { SubscribersNotifications } from './subscribers-notifications.entity';

@Entity('subscribers')
export class Subscriber extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  expirationTime: Date;

  @Column('simple-json')
  keys: Key;

  @OneToMany(type => SubscribersNotifications,
    subscribersNotifications => subscribersNotifications.subscriber, {
      eager: true,
    })
  subscribersNotifications: SubscribersNotifications[];

}
