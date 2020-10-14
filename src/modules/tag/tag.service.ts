import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { TagDto } from './dto/tag.dto';
import { ProductService } from '../product/product.service';
import { SubCategoryService } from '../category/services/sub-category.service';


@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
              @Inject(forwardRef(() => ProductService)) private productService: ProductService,
              @Inject(forwardRef(() => SubCategoryService)) private subCategoryService: SubCategoryService) {
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  async getTotalTags() {
    return await this.tagRepo.createQueryBuilder().getCount();
  }

  async createNewTag(createTagDto: TagDto): Promise<Tag> {
    const { name } = createTagDto;
    const tag = new Tag();
    tag.name = name;
    const newTag = await tag.save();
    return newTag;
  }

  async getTagById(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: {
        id,
      },
    });
    if (!tag) {
      throw  new NotFoundException(`Tag with id ${id} does not found`);
    }
    return tag;
  }

  async updateTag(id: number, updateTagDto: TagDto): Promise<Tag> {
    const tag = await this.getTagById(id);
    const { name } = updateTagDto;
    tag.name = name;
    tag.updatedAt = new Date(Date.now());
    return await tag.save();
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.getTagById(id);
    const products = await this.productService.searchForProductsByTagName(tag.name);
    const subCategories = await this.subCategoryService.getSubCategoriesByTagName(tag.name);
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].productTags.length; j++) {
        if (products[i].productTags[j].tagId === tag.id) {
          await this.productService.productTagRepository.delete(products[i].productTags[j].id);
        }
      }
    }
    for (let i = 0; i < subCategories.length; i++) {
      for (let j = 0; j < subCategories[i].subCategoryTags.length; j++) {
        if (subCategories[i].subCategoryTags[j].tagId === tag.id) {
          await this.subCategoryService.subCategoryTagRepository.delete(subCategories[i].subCategoryTags[j].id);
        }
      }
    }
    const result = await this.tagRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with id ${id} does not found!`);
    }
  }
}
