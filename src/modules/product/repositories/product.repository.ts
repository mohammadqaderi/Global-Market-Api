import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductsCustomFilterDto } from '../dto/products-custom-filter.dto';

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

  async getMixLatestProduct() {
    const queryBuilder = this.getQueryBuilder();
    const products = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag').take(16).getMany();
    const filteredProducts = [].concat(products.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      }));
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


  async getTotalProducts() {
    return await this.createQueryBuilder().getCount();
  }

  async getTotalSales(): Promise<number> {
    const { sum } = await this
      .createQueryBuilder('product')
      .select('SUM(product.sales)', 'sum').getRawOne();
    return sum ? sum : 0;
  }


  async customFilter(productsCustomFilterDto: ProductsCustomFilterDto) {
    const { range1, range2, skip, stock, take } = productsCustomFilterDto;
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .where('product.id IS NOT NULL');
    if (range1) {
      queryBuilder.andWhere('product.currentPrice >= :range1', { range1: range1 });
    }
    if (range2) {
      queryBuilder.andWhere('product.currentPrice <= :range2', { range2: range2 });
    }
    if (stock) {
      const inStock = stock === 'In Stock';
      if (inStock) {
        queryBuilder.andWhere('product.inStock = :stock', { stock: true });
      } else {
        queryBuilder.andWhere('product.inStock = :stock', { stock: false });
      }
    }
    if (skip) {
      queryBuilder.skip(skip);
    }
    if (take) {
      queryBuilder.take(take);
    }

    let products = await queryBuilder.getMany();
    return products;
  }
}
