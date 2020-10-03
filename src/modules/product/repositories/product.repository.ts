import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

  async getShopProducts(take: number) {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .take(take).getMany();
    return products;
  }

  async getProductsByTagName(tag: string) {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .where('productTag.productId IS NOT NULL AND productTag.name LIKE :name', { name: tag }).getMany();
    return products;
  }

  async getCurrentMonthProducts() {
    const queryBuilder = this.getQueryBuilder();
    const currentMonth = new Date().getMonth();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag').take(16).getMany();
    const filteredProducts = [].concat(products.filter(p => (p.createdAt.getMonth() + 1) === currentMonth));
    return filteredProducts;
  }

  async getLatestProducts() {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .take(10).orderBy('product.createdAt').getMany();
    return products;
  }

  async getMostSalesProducts() {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.orderBy({
      'product.sales': 'DESC',
    }).leftJoinAndSelect('product.productTags', 'productTag')
      .take(10).getMany();
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
      .take(limit).getMany();

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
