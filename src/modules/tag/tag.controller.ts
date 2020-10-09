import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './dto/tag.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../commons/decorators/roles.decorator';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { UserRole } from '../../commons/enums/user-role.enum';
import { ProductService } from '../product/product.service';
import { SubCategoryService } from '../category/services/sub-category.service';


@Controller('tags')
export class TagController {
  constructor(private tagService: TagService, private productService: ProductService,
              private subCategoryService: SubCategoryService) {
  }

  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }

  @Get('sub-categories')
  getSubCategoriesTags() {
    return this.subCategoryService.getSubCategoryTags();
  }

  @Get('products')
  getProductsTags() {
    return this.productService.getProductsTags();
  }

  @Post('new')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  newTag(@Body() createTagDto: TagDto) {
    return this.tagService.createNewTag(createTagDto);
  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }

  @Get(':id')
  getTagById(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.getTagById(id);
  }

  @Put(':id/update')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: TagDto) {
    return this.tagService.updateTag(id, updateTagDto);
  }

}
