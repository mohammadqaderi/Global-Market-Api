import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto, SubCategoryDto } from '../dto/category.dto';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import { ThrowErrors } from '../../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;


@Injectable()
export class CategoryService {

  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      NotFound('Category', id);
    }
    return category;
  }

  async updateCategory(id: number, updateCategoryDto: CategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);
    const { name, description, icon } = updateCategoryDto;
    if (name) {
      category.name = name;
    }
    if (icon) {
      category.icon = icon;
    }
    if (description) {
      category.description = description;
    }
    const updatedCategory = await category.save();
    return updatedCategory;
  }


  async newCategory(createCategoryDto: CategoryDto): Promise<Category> {
    const { name, description, icon } = createCategoryDto;
    const category = new Category();
    category.name = name;
    category.description = description;
    category.subCategories = [];
    category.icon = icon;
    const newCategory = await category.save();
    return newCategory;
  }


  async addSubCategory(id: number, subCategoryDto: SubCategoryDto): Promise<SubCategory> {
    const category = await this.getCategoryById(id);
    const { name, description, references, icon } = subCategoryDto;
    const subCategory = new SubCategory();
    subCategory.category = category;
    subCategory.categoryTags = [];
    subCategory.references = references;
    subCategory.name = name;
    subCategory.icon = icon;
    subCategory.description = description;
    subCategory.products = [];
    const newSubCategory = await subCategory.save();
    return newSubCategory;
  }


  async deleteCategory(id: number) {
    const category = await this.getCategoryById(id);
    for (let i = 0; i < category.subCategories.length; i++) {
      // delete sub categories
    }
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      NotFound('Category', id);
    }
  }
}
