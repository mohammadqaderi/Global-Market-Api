import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractCategory extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  description: string;

  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;
}
