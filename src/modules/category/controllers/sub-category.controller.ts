import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InsertTagDto } from '../../../shared/dto/insert-tag.dto';
import { SubCategoryService } from '../services/sub-category.service';
import { SubCategoryDto } from '../dto/category.dto';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@Controller('sub-categories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {
  }

  @Get()
  getAllSubCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Get(':id')
  getSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getSubCategory(id);
  }

  @Post(':id/new-product/:username')
  @UseInterceptors(FilesInterceptor('images'))
  newProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('username') username: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('references') references: number[],
    @Body('inStock', ParseBoolPipe) inStock: boolean,
    @Body('price', ParseIntPipe) price: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @UploadedFiles() images: any,
  ) {
    return this.subCategoryService.newProduct(id, username, {
      name,
      description,
      images,
      inStock,
      quantity,
      price,
      references,
    });
  }

  @Post(':id/add-tags')
  addTagsToCategory(@Param('id', ParseIntPipe) id: number,
                    @Body() payload: InsertTagDto) {
    return this.subCategoryService.addTagsToCategory(id, payload);

  }

  @Delete(':id/delete')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }

  @Put(':id/update')
  updateSubCategory(@Param('id', ParseIntPipe) id: number,
                    @Body() updateSubCategoryDto: SubCategoryDto) {
    return this.subCategoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @Delete(':id/remove-tags')
  removeTagsFromCategory(@Param('id', ParseIntPipe) id: number,
                         @Body('tags', ParseArrayPipe) categoryTags: number[]) {
    return this.subCategoryService.removeTagsFromCategory(id, categoryTags);

  }

}
