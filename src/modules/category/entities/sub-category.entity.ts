import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { CategoryTag } from './category-tag.entity';
import { AbstractCategory } from '../../../commons/classes/abstract-category';
import { Category } from './category.entity';

@Entity('sub-categories')
@Unique(['name'])
export class SubCategory extends AbstractCategory {
  @OneToMany(type => Product, product => product.subCategory, {
    eager: true,
  })
  products: Product[];


  @OneToMany(type => CategoryTag, categoryTag => categoryTag.subCategory, {
    eager: true,
  })
  categoryTags: CategoryTag[];

  @ManyToOne(type => Category, category => category.subCategories, {
    eager: false,
  })
  category: Category;

  @Column('int', {
    array: true
  })
  references: Array<number>;

}
