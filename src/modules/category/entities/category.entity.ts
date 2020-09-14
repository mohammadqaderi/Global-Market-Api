import { Entity, OneToMany, Unique } from 'typeorm';
import { AbstractCategory } from '../../../commons/classes/abstract-category';
import { SubCategory } from './sub-category.entity';

@Entity('categories')
@Unique(['name'])
export class Category extends AbstractCategory {

  @OneToMany(type => SubCategory, subCategory => subCategory.category, {
    eager: true,
  })
  subCategories: SubCategory[];

}
