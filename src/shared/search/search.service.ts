import { Injectable } from '@nestjs/common';
import { ProductService } from '../../modules/product/product.service';
import { SubCategoryService } from '../../modules/category/services/sub-category.service';
import { CategoryService } from '../../modules/category/services/category.service';


@Injectable()
export class SearchService {
  constructor(private productService: ProductService, private subCategoryService: SubCategoryService,
              private categoryService: CategoryService) {

  }

  async search(name: string, type: string, take: number): Promise<any[]> {
    let arr = [];
    switch (type) {
      case 'Categories': {
        arr = await this.categoryService.searchByName(name, take);
        return arr;
      }
      case 'Sub Categories': {
        arr = await this.subCategoryService.searchByName(name, take);
        return arr;
      }
      case 'Products': {
        arr = await this.productService.searchByName(name, take);
        return arr;
      }
    }
  }
}
