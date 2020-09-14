import { Column, Entity, ManyToOne } from 'typeorm';
import { Tag } from '../../tag/tag.entity';
import { ItemTag } from '../../../commons/classes/item-tag';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';


@Entity('sub-category-tag')
export class CategoryTag extends ItemTag {


  @ManyToOne(type => Tag, tag => tag.categoryTags, {
    eager: false,
  })
  tag: Tag;

  @ManyToOne(type => SubCategory, subCategory => subCategory.categoryTags, {
    eager: false,
  })
  subCategory: SubCategory;

  @Column()
  subCategoryId: number;
}
