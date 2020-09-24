import { Column, Entity, ManyToOne } from 'typeorm';
import { ItemTag } from '../../../commons/classes/item-tag';
import { Product } from './product.entity';


@Entity('product-tag')
export class ProductTag extends ItemTag {

  @ManyToOne(type => Product, product => product.productTags, {
    eager: false,
  })
  product: Product;

  @Column()
  productId: number;

}
