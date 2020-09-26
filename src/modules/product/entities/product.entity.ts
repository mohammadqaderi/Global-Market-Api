import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractProduct } from '../../../commons/classes/abstract-product';
import { ProductTag } from './product-tag.entity';
import { SubCategory } from '../../category/entities/sub-category.entity';


@Entity('products')
@Unique(['name'])
export class Product extends AbstractProduct {
  @Column('text', {
    array: true,
  })
  images: string[];

  @Column()
  description: string;


  @Column('int', {
    array: true,
    nullable: true,
  })
  references: Array<number>;

  @Column({
    default: true,
  })
  inStock: boolean;

  @Column('float', {
    default: 0.0,
  })
  currentPrice: number;

  @Column('float', {
    nullable: true,
  })
  previousPrice: number;

  @Column({
    default: 0,
  })
  sales: number;

  @OneToMany(type => ProductTag, productTag => productTag.product, {
    eager: true,
    nullable: true,
  })
  productTags: ProductTag[];


  @ManyToOne(type => SubCategory, subCategory => subCategory.products, {
    eager: false,
  })
  subCategory: SubCategory;

  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column()
  subCategoryId: number;

}
