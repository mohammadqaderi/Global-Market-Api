import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Gender } from '../../commons/enums/gender.enum';
import { User } from '../auth/entities/user.entity';
import { Contact } from '../../commons/classes/contact';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  age: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({
    type: 'jsonb',
    array: false,
  })
  contacts: Array<Contact>;

  @Column({
    nullable: true,
  })
  image: string;

  @OneToOne(type => User, user => user.profile, {
    eager: true,
  })
  user: User;


}
