import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import { Repository } from 'typeorm';
import { AwsService } from '../../../shared/modules/aws/aws.service';
import { Product } from '../../product/entities/product.entity';
import { InsertTagDto } from '../../../shared/dto/insert-tag.dto';
import { SubCategoryTag } from '../entities/sub-category-tag.entity';
import { SubCategoryDto } from '../dto/category.dto';
import { ThrowErrors } from '../../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { TagService } from '../../tag/tag.service';
import { ProductService } from '../../product/product.service';
import { SubCategoryRepository } from '../repositories/sub-category.repository';


@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    @InjectRepository(SubCategoryTag) public readonly subCategoryTagRepository: Repository<SubCategoryTag>,
    @Inject(forwardRef(() => ProductService)) private productService: ProductService,
    private awsService: AwsService,
    @Inject(forwardRef(() => TagService)) private tagService: TagService) {
  }

  async fetchMixLatestProducts() {
    const subCategories = await this.getAllSubCategories();
    const date = new Date(Date.now());
    const currentMonth = date.getMonth();
    let mixFilteredProducts = [];
    for (const subCategory of subCategories) {
      const products: Product[] = subCategory.products
        .filter(p => ((p.createdAt.getMonth() + 1) === (currentMonth + 1)) && (p.inStock === true));
      mixFilteredProducts = mixFilteredProducts.concat(products.slice(0, 1));
    }
    return mixFilteredProducts;
  }

  async getAllSubCategories() {
    return await this.subCategoryRepository.find();
  }

  async searchByName(name: string, take: number) {
    const queryBuilder = this.subCategoryRepository.createQueryBuilder('subCategory');
    const subCategories
      = await queryBuilder.leftJoinAndSelect('subCategory.products', 'product')
      .where('subCategory.name ILIKE :name', { name: `%${name}%` })
      .take(take)
      .getMany();
    return subCategories;
  }

  async getSubCategoryTags() {
    const subCategoriesTags = await this.subCategoryTagRepository.find();
    let uniqueArray: SubCategoryTag[] = [];
    for (let i = 0; i < subCategoriesTags.length; i++) {
      const item = uniqueArray.find(item => item.name === subCategoriesTags[i].name);
      if (!item) {
        uniqueArray = [...uniqueArray, subCategoriesTags[i]];
      }
    }
    return uniqueArray;
  }

  async getTotalSubCategories() {
    return await this.subCategoryRepository.createQueryBuilder().getCount();
  }

  async getSubCategoriesByTagName(tagName: string) {
    return await this.subCategoryRepository.getSubCategoriesByTagName(tagName);
  }

  async getSubCategory(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subCategory) {
      NotFound('Sub Category', id);
    }
    return subCategory;
  }

  async newProduct(subCategoryId: number, folderName: string, subFolder: string, type: string, productPayload: {
    name: string,
    description: string,
    images: any,
    quantity: number,
    currentPrice: number,
    references: any
  }) {
    const subCategory = await this.getSubCategory(subCategoryId);
    const { name, description, references, images, currentPrice, quantity } = productPayload;
    const product = new Product();
    product.name = name;
    product.description = description;
    product.references = [];
    if (references) {
      for (let i = 0; i < references.length; i++) {
        product.references.push(+references[i]);
      }
    }
    product.currentPrice = currentPrice;
    product.images = [];
    product.quantity = quantity;
    product.productTags = [];
    product.subCategory = subCategory;
    for (let i = 0; i < images.length; i++) {
      const img = await this.awsService.fileUpload(images[i],
        { folderName: folderName, type: type, subFolder: subFolder });
      product.images = [...product.images, img];
    }
    const newProduct = await product.save();
    return newProduct;
  }

  async updateSubCategory(id: number, updateSubCategoryDto: SubCategoryDto): Promise<SubCategory> {
    const subCategory = await this.getSubCategory(id);
    const { name, description, references } = updateSubCategoryDto;
    if (name) {
      subCategory.name = name;
    }
    if (description) {
      subCategory.description = description;
    }
    if (references) {
      subCategory.references = references;
    }
    subCategory.updatedAt = new Date();
    const updatedSubCategory = await subCategory.save();
    return updatedSubCategory;
  }

  async deleteSubCategory(id: number) {
    const subCategory = await this.getSubCategory(id);
    for (let i = 0; i < subCategory.products.length; i++) {
      await this.productService.deleteProduct(subCategory.products[i].id);
    }
    for (let i = 0; i < subCategory.subCategoryTags.length; i++) {
      await this.subCategoryTagRepository.delete(subCategory.subCategoryTags[i].id);
    }
    const result = await this.subCategoryRepository.delete(id);
    if (result.affected === 0) {
      NotFound('Sub Category', id);
    }
  }

  async addTagsToCategory(id: number, payload: InsertTagDto): Promise<SubCategoryTag[]> {
    const subCategory = await this.getSubCategory(id);
    let addedTags: SubCategoryTag[] = [];
    for (let i = 0; i < payload.tags.length; i++) {
      const subCategoryTag = new SubCategoryTag();
      subCategoryTag.subCategory = subCategory;
      const tag = await this.tagService.getTagById(payload.tags[i]);
      subCategoryTag.tagId = tag.id;
      subCategoryTag.name = tag.name;
      const newSubCategoryTag = await subCategoryTag.save();
      addedTags = [...addedTags, newSubCategoryTag];
    }
    return addedTags;
  }

  async removeTagsFromCategory(id: number, payload: any): Promise<SubCategory> {
    const subCategory = await this.getSubCategory(id);
    for (let i = 0; i < payload.tags.length; i++) {
      const subCategoryTag = subCategory.subCategoryTags.find(ct => ct.id === payload.tags[i]);
      if (subCategoryTag) {
        await this.subCategoryTagRepository.delete(subCategoryTag.id);
        subCategory.subCategoryTags = subCategory.subCategoryTags.filter(sTag => sTag.id !== subCategoryTag.id);
      }
    }
    return await subCategory.save();
  }
}
