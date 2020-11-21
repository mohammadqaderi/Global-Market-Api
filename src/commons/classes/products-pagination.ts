import { Product } from '../../modules/product/entities/product.entity';

export class ProductsPagination {
  products: Product[];
  currentPage: number;
  nextPage: number;
  previousPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastPage: number;
}
