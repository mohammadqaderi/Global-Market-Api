import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryDto, SubCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';

@Controller('categories')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) {
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }


  @Post()
  newCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoryService.newCategory(createCategoryDto);
  }


  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Post(':id/new-sub-category')
  newSubCategory(@Param('id', ParseIntPipe) id: number,
                 @Body() subCategoryDto: SubCategoryDto) {
    return this.categoryService.addSubCategory(id, subCategoryDto);
  }

  @Put(':id/update')
  updateCategory(@Param('id', ParseIntPipe) id: number,
                 @Body() updateCategoryDto: CategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id/delete')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }


}
