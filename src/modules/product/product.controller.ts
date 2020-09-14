import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { InsertTagDto } from '../../shared/dto/insert-tag.dto';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id/update')
  updateProduct(@Param('id', ParseIntPipe) id: number,
                @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Post(':productId/add-to-cart/:cartId')
  addToCart(@Param('productId', ParseIntPipe) productId: number,
            @Param('cartId', ParseIntPipe) cartId: number) {
    return this.productService.addProductToCart(productId, cartId);
  }

  @Post(':id/add-tags')
  addTagsToProduct(@Param('id', ParseIntPipe) id: number,
                   @Body() payload: InsertTagDto) {
    return this.productService.addTagsToProduct(id, payload);
  }

  @Delete(':id/remove-tags')
  removeTagsFromProduct(@Param('id', ParseIntPipe) id: number,
                        @Body('tags', ParseArrayPipe) productTags: number[]) {
    return this.productService.removeTagsFromProduct(id, productTags);
  }

  @Delete(':id/delete')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
