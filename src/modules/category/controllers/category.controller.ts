import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryDto, SubCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../../commons/guards/admin-auth.guard';
import { Roles } from '../../../commons/decorators/roles.decorator';
import { UserRole } from '../../../commons/enums/user-role.enum';

@Controller('categories')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) {
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post()
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  newCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoryService.newCategory(createCategoryDto);
  }


  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Get('match-by-name/:name')
  searchMatchByName(@Param('name') name: string) {
    return this.categoryService.getMatchingByNames(name);
  }

  @Post(':id/new-sub-category')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  newSubCategory(@Param('id', ParseIntPipe) id: number,
                 @Body() subCategoryDto: SubCategoryDto) {
    return this.categoryService.addSubCategory(id, subCategoryDto);
  }

  @Put(':id/update')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  updateCategory(@Param('id', ParseIntPipe) id: number,
                 @Body() updateCategoryDto: CategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }

}
