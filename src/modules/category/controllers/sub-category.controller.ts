import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InsertTagDto } from '../../../shared/dto/insert-tag.dto';
import { SubCategoryService } from '../services/sub-category.service';
import { SubCategoryDto } from '../dto/category.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../../commons/guards/admin-auth.guard';
import { Roles } from '../../../commons/decorators/roles.decorator';
import { UserRole } from '../../../commons/enums/user-role.enum';


@Controller('sub-categories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {
  }

  @Get()
  getAllSubCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Get('search-by-tag-name/:tagName')
  getSubCategoriesByTagName(@Param('tagName') tagName: string) {
    return this.subCategoryService.getSubCategoriesByTagName(tagName);
  }

  @Get(':id')
  getSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.getSubCategory(id);
  }

  @Post(':id/new-product/:folderName/:subFolder/:type')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  newProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: string,
    @Param('folderName') folderName: string,
    @Param('subFolder') subFolder: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('references') refArr: any,
    @Body('currentPrice', ParseIntPipe) currentPrice: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @UploadedFiles() images: any,
  ) {
    return this.subCategoryService.newProduct(id, folderName, subFolder, type, {
      name,
      description,
      images,
      quantity,
      currentPrice,
      references: refArr ? JSON.parse(refArr) : null,
    });
  }

  @Post(':id/add-tags')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  addTagsToCategory(@Param('id', ParseIntPipe) id: number,
                    @Body() payload: InsertTagDto) {
    return this.subCategoryService.addTagsToCategory(id, payload);

  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }

  @Put(':id/update')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  updateSubCategory(@Param('id', ParseIntPipe) id: number,
                    @Body() updateSubCategoryDto: SubCategoryDto) {
    return this.subCategoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @Delete(':id/remove-tags')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  removeTagsFromCategory(@Param('id', ParseIntPipe) id: number,
                         @Body() data: any) {
    const { payload } = data;
    return this.subCategoryService.removeTagsFromCategory(id, payload);

  }

}
