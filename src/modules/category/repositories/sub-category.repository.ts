import { EntityRepository, Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';


@EntityRepository(SubCategory)
export class SubCategoryRepository extends Repository<SubCategory> {
  async getSubCategoriesByTagName(tag: string) {
    const query = this.createQueryBuilder('subCategory');
    const subCategories = await query.leftJoinAndSelect('subCategory.subCategoryTags', 'subCategoryTag')
      .where('subCategoryTag.subCategoryId IS NOT NULL AND subCategoryTag.name = :name', { name: tag })
      .leftJoinAndSelect('subCategory.products', 'product').getMany();
    return subCategories;
  }
}
