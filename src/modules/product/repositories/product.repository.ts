import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductsCustomFilterDto } from '../dto/products-custom-filter.dto';
import { ProductsPagination } from '../../../commons/classes/products-pagination';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {


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


  async customFilter(productsCustomFilterDto: ProductsCustomFilterDto): Promise<ProductsPagination> {
    const { range1, range2, limit, stock, subCategoryId, tag, page } = productsCustomFilterDto;
    const queryBuilder = this.getQueryBuilder();
    const currentPage = page || 1;
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
    if (subCategoryId) {
      queryBuilder.andWhere('product.subCategoryId = :subCategoryId', { subCategoryId: subCategoryId });
    }
    if (tag) {
      queryBuilder.andWhere('productTag.productId IS NOT NULL AND productTag.name LIKE :name', { name: tag });
    }
    const totalProducts = await queryBuilder.getCount();

    const products = await queryBuilder
      .skip((currentPage - 1) * limit)
      .take(limit).orderBy({ 'product.createdAt': 'ASC' }).getMany();

    return {
      products: products,
      currentPage: currentPage,
      hasNextPage: limit * currentPage < totalProducts,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage + 1,
      previousPage: currentPage - 1,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

  async getShopProducts(pageNumber: number, limit: number): Promise<ProductsPagination> {
    const page = pageNumber || 1;
    const queryBuilder = this.getQueryBuilder();
    const totalProducts = await queryBuilder.getCount();
    const products = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .skip((page - 1) * limit)
      .take(limit).getMany();
    return {
      products: products,
      currentPage: page,
      hasNextPage: limit * page < totalProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

  async searchByName(name: string, pageNumber: number, limit: number) {
    const page = pageNumber || 1;
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.select(['product.id', 'product.name', 'product.inStock', 'product.images',
      'product.currentPrice', 'product.previousPrice'])
      .where('product.name ILIKE :name', { name: `%${name}%` });
    const totalProducts = await queryBuilder.getCount();
    const products
      = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    return {
      products: products,
      currentPage: page,
      hasNextPage: limit * page < totalProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

}
