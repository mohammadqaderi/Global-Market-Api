import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { InsertTagDto } from '../../shared/dto/insert-tag.dto';
import { ProductTag } from './entities/product-tag.entity';
import { Product } from './entities/product.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { UpdateProductDto } from './dto/update-product.dto';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { TagService } from '../tag/tag.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProductService {

  constructor(private readonly productRepository: ProductRepository,
              @InjectRepository(ProductTag) private readonly productTagRepository: Repository<ProductTag>,
              private awsService: AwsService,
              private tagService: TagService) {
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      NotFound('Product', id);
    }
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(id);
    const { name, references, price, quantity, description, inStock } = updateProductDto;
    if (product.name) {
      product.name = name;
    }
    if (product.description) {
      product.description = description;
    }
    if (product.inStock) {
      product.inStock = inStock;
    }
    if (product.quantity) {
      product.quantity = quantity;
    }
    if (product.price) {
      product.price = price;
    }
    if (product.references) {
      product.references = references;
    }
    const updatedProduct = await product.save();
    return updatedProduct;
  }

  async addProductToCart(productId: number, cartId: number) {

  }

  async addTagsToProduct(productId: number, payload: InsertTagDto): Promise<ProductTag[]> {
    const product = await this.getProductById(productId);
    let addedProductTags: ProductTag[] = [];
    for (let i = 0; i < payload.tags.length; i++) {
      const productTag = new ProductTag();
      productTag.product = product;
      const tag = await this.tagService.getTagById(payload.tags[i]);
      productTag.tag = tag;
      productTag.name = tag.name;
      const newProductTag = await productTag.save();
      addedProductTags = [...addedProductTags, newProductTag];
    }
    return addedProductTags;
  }

  async removeTagsFromProduct(id: number, productTags: number[]): Promise<void> {
    const product = await this.getProductById(id);
    for (let i = 0; i < productTags.length; i++) {
      const productTag = product.productTags.find(ct => ct.id === productTags[i]);
      if (productTag) {
        await this.productTagRepository.delete(productTag.id);
      }
    }
  }

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    for (let i = 0; i < product.productTags.length; i++) {
      // delete product tags
    }
    for (let i = 0; i < product.cartProducts.length; i++) {
      // delete products in the cart
    }
    for (let i = 0; i < product.images.length; i++) {
      await this.awsService.fileDelete(product.images[i]);
    }
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      NotFound('Product', id);
    }
  }
}
