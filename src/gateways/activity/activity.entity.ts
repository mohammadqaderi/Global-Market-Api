import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityType } from '../../commons/enums/activity-type.enum';

@Entity('activities')
export class Activity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: ActivityType;

  @Column()
  user: string;

  @Column()
  description: string;

  @Column()
  time: Date;
}
