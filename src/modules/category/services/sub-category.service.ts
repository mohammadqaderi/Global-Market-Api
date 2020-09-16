import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import { Repository } from 'typeorm';
import { AwsService } from '../../../shared/modules/aws/aws.service';
import { Product } from '../../product/entities/product.entity';
import { InsertTagDto } from '../../../shared/dto/insert-tag.dto';
import { CategoryTag } from '../entities/category-tag.entity';
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
    @InjectRepository(CategoryTag) private readonly categoryTagRepository: Repository<CategoryTag>,
    private productService: ProductService,
    private awsService: AwsService,
    private tagService: TagService) {
  }

  async getAllSubCategories() {
    return await this.subCategoryRepository.find();
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
    inStock: boolean,
    quantity: number,
    price: number,
    references: number[]
  }) {
    const subCategory = await this.getSubCategory(subCategoryId);
    const { name, description, references, images, inStock, price, quantity } = productPayload;
    const product = new Product();
    product.name = name;
    product.description = description;
    product.inStock = inStock;
    if (!references) {
      product.references = [];
    }
    product.price = price;
    product.images = [];
    product.quantity = quantity;
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
    const { name, description, references, icon } = updateSubCategoryDto;
    if (name) {
      subCategory.name = name;
    }
    if (icon) {
      subCategory.icon = icon;
    }
    if (description) {
      subCategory.description = description;
    }
    if (references) {
      subCategory.references = references;
    }
    const updatedSubCategory = await subCategory.save();
    return updatedSubCategory;
  }

  async deleteSubCategory(id: number) {
    const subCategory = await this.getSubCategory(id);
    for (let i = 0; i < subCategory.products.length; i++) {
      await this.productService.deleteProduct(subCategory.products[i].id);
    }
    for (let i = 0; i < subCategory.categoryTags.length; i++) {
      await this.categoryTagRepository.delete(subCategory.categoryTags[i].id);
    }
    const result = await this.subCategoryRepository.delete(id);
    if (result.affected === 0) {
      NotFound('Sub Category', id);
    }
  }

  async addTagsToCategory(id: number, payload: InsertTagDto): Promise<CategoryTag[]> {
    const subCategory = await this.getSubCategory(id);
    let addedTags: CategoryTag[] = [];
    for (let i = 0; i < payload.tags.length; i++) {
      const categoryTag = new CategoryTag();
      categoryTag.subCategory = subCategory;
      const tag = await this.tagService.getTagById(payload.tags[i]);
      categoryTag.tag = tag;
      categoryTag.name = tag.name;
      const newCategoryTag = await categoryTag.save();
      addedTags = [...addedTags, newCategoryTag];
    }
    return addedTags;
  }

  async removeTagsFromCategory(id: number, categoryTags: number[]): Promise<void> {
    const subCategory = await this.getSubCategory(id);
    for (let i = 0; i < categoryTags.length; i++) {
      const categoryTag = subCategory.categoryTags.find(ct => ct.id === categoryTags[i]);
      if (categoryTag) {
        console.log(`category tag with id: ${categoryTag.id} exist`);
        await this.categoryTagRepository.delete(categoryTag.id);
      }
    }
  }
}
