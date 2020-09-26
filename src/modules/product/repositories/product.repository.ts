import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {


  async getProductsByTagName(tag: string) {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .where('productTag.productId IS NOT NULL AND productTag.name LIKE :name', { name: tag }).getMany();
    return products;
  }

  async getLimitedProducts(limit: number) {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .limit(limit).getMany();
    return products;
  }

  getQueryBuilder() {
    return this.createQueryBuilder('product');
  }

  async filterByRangePrice(limit: number, range1: number, range2: number) {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .where('product.price >= :range1', { range1: range1 })
      .andWhere('product.price <= :range2', { range2: range2 })
      .limit(limit).getMany();

    return products;
  }

  async getTotalProducts() {
    return await this.createQueryBuilder().getCount();
  }

  async getTotalSales(): Promise<number> {
    const { sum } = await this
      .createQueryBuilder('product')
      .select('SUM(product.sales)', 'sum').getRawOne();
    return sum ? sum : 0;
  }

  async filterByExistenceInStock(limit: number, inStock?: boolean, outOfStock?: boolean) {
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.leftJoinAndSelect('product.productTags', 'productTag');
    if (inStock) {
      queryBuilder.where('product.inStock = :stock', { stock: inStock });
    } else {
      queryBuilder.where('product.inStock != :stock', { stock: outOfStock });
    }
    const products = await queryBuilder.limit(limit).getMany();
    return products;
  }
}
