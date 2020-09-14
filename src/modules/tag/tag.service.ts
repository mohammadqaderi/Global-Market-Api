import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { TagDto } from './dto/tag.dto';


@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepo: Repository<Tag>) {
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  async createNewTag(createTagDto: TagDto): Promise<Tag> {
    const { name } = createTagDto;
    const tag = new Tag();
    tag.name = name;
    tag.categoryTags = [];
    tag.productTags = [];
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
    tag.updatedAt = new Date();
    return await tag.save();
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.getTagById(id);
    for (let i = 0; i < tag.productTags.length; i++) {
      // delete product tags
    }

    for (let i = 0; i < tag.categoryTags.length; i++) {
      // delete category tags
    }
    const result = await this.tagRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with id ${id} does not found!`);
    }
  }
}
