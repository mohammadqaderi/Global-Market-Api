import { EntityRepository, Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';


@EntityRepository(SubCategory)
export class SubCategoryRepository extends Repository<SubCategory> {
  async getSubCategoriesByTagName(tag: string) {
    const query = this.createQueryBuilder('subCategory');
    const subCategories = await query.leftJoinAndSelect('subCategory.categoryTags', 'categoryTag')
      .where('categoryTag.subCategoryId IS NOT NULL AND categoryTag.name = :name', { name: tag })
      .leftJoinAndSelect('subCategory.products', 'product').getMany();
    return subCategories;
  }
}
