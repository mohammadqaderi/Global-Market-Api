import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { InsertTagDto } from '../../shared/dto/insert-tag.dto';
import { CreateCartProductDto } from '../cart/dto/create-cart-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { UserRole } from '../../commons/enums/user-role.enum';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { ProductsCustomFilterDto } from './dto/products-custom-filter.dto';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }




  @Get('shop')
  getShopProducts(@Query('take', ParseIntPipe) take: number) {
    return this.productService.getShopProducts(take);
  }


  @Get('count')
  getTotalProducts() {
    return this.productService.getTotalProducts();
  }

  @Get('sales')
  getTotalSales() {
    return this.productService.getTotalSales();
  }

  @Get('current-month')
  async getCurrentMonthProducts() {
    return await this.productService.getCurrentMonthProducts();
  }


  @Get('most-sales')
  async getMostSalesProducts() {
    return await this.productService.getMostSalesProducts();
  }

  @Post('custom-filter')
  getFilteredBetweenRange(@Body() productsCustomFilterDto: ProductsCustomFilterDto) {
    return this.productService.customFilter(productsCustomFilterDto);
  }

  @Get('search-by-tag-name/:tagName')
  getProductsByTagName(@Param('tagName') tagName: string) {
    return this.productService.searchForProductsByTagName(tagName);
  }
  @Get('match-by-name/:name')
  searchMatchByName(@Param('name') name: string) {
    return this.productService.getMatchingByNames(name);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id/update')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  updateProduct(@Param('id', ParseIntPipe) id: number,
                @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Post(':productId/add-to-cart/:cartId')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(UserRole.USER)
  addToCart(@Param('productId', ParseIntPipe) productId: number,
            @Param('cartId', ParseIntPipe) cartId: number,
            @Body() createCartProductDto: CreateCartProductDto) {
    return this.productService.addProductToCart(productId, cartId, createCartProductDto);
  }

  @Post(':id/add-tags')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  addTagsToProduct(@Param('id', ParseIntPipe) id: number,
                   @Body() payload: InsertTagDto) {
    return this.productService.addTagsToProduct(id, payload);
  }

  @Put(':productId/manage-images/:folderName/:subFolder/:type')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  manageProductImages(@Param('productId', ParseIntPipe) productId: number,
                      @Param('type') type: string,
                      @Param('folderName') folderName: string,
                      @Param('subFolder') subFolder: string,
                      @Body('removedImages') removedImages: any,
                      @UploadedFiles() images: any) {
    return this.productService.manageProductImages
    (productId, { removedImages: removedImages ? JSON.parse(removedImages) : null, newImages: images },
      type, folderName, subFolder);
  }

  @Delete(':id/remove-tags')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  removeTagsFromProduct(@Param('id', ParseIntPipe) id: number,
                        @Body() data: any) {
    const { payload } = data;
    return this.productService.removeTagsFromProduct(id, payload);
  }

  @Delete(':id/delete')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
