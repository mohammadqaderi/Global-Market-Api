import { Column, Entity, ManyToOne } from 'typeorm';
import { Tag } from '../../tag/tag.entity';
import { ItemTag } from '../../../commons/classes/item-tag';
import { Product } from './product.entity';


@Entity('product-tag')
export class ProductTag extends ItemTag {

  @ManyToOne(type => Tag, tag => tag.productTags, {
    eager: false,
  })
  tag: Tag;

  @ManyToOne(type => Product, product => product.productTags, {
    eager: false,
  })
  product: Product;

  @Column()
  productId: number;

}
