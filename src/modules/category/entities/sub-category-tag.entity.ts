import { Column, Entity, ManyToOne } from 'typeorm';
import { ItemTag } from '../../../commons/classes/item-tag';
import { SubCategory } from './sub-category.entity';

@Entity('sub-category-tag')
export class SubCategoryTag extends ItemTag {


  @ManyToOne(type => SubCategory, subCategory => subCategory.subCategoryTags, {
    eager: false,
  })
  subCategory: SubCategory;

  @Column()
  subCategoryId: number;
}
