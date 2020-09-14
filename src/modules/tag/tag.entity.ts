import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProductTag } from '../product/entities/product-tag.entity';
import { CategoryTag } from '../category/entities/category-tag.entity';


@Entity('tags')
@Unique(['name'])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => ProductTag, productTag => productTag.tag, {
    eager: true,
  })
  productTags: ProductTag[];

  @OneToMany(type => CategoryTag, categoryTag => categoryTag.tag, {
    eager: true,
  })
  categoryTags: CategoryTag[];

  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

}
