import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { CartService } from '../cart/cart.service';
import { CartProduct } from '../cart/entities/cart-product.entity';
import { CreateCartProductDto } from '../cart/dto/create-cart-product.dto';
import { Cart } from '../cart/entities/cart.entity';


@Injectable()
export class ProductService {

  constructor(private readonly productRepository: ProductRepository,
              @InjectRepository(ProductTag) private readonly productTagRepository: Repository<ProductTag>,
              private awsService: AwsService,
              @Inject(forwardRef(() => CartService)) private cartService: CartService,
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

  async searchForProductsByTagName(tagName: string) {
    return await this.productRepository.getProductsByTagName(tagName);
  }

  async getFilteredBetweenRange(range1: number, range2: number) {
    return await this.productRepository.filterByRangePrice(6, range1, range2);
  }

  async getFilteredByStockExistence(stock: boolean) {
    return await this.productRepository.filterByExistenceInStock(6, stock);
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

  async addProductToCart(productId: number, cartId: number, createCartProductDto: CreateCartProductDto) {
    const cart = await this.cartService.getUserCart(null, cartId);
    const product = await this.getProductById(productId);
    const { quantity } = createCartProductDto;
    const cartProduct = new CartProduct();
    cartProduct.productId = product.id;
    cartProduct.image = product.images[0];
    cartProduct.quantity = quantity;
    cartProduct.totalPrice = product.price * quantity;
    cartProduct.name = product.name;
    cart.totalItems += 1;
    product.quantity = product.quantity - quantity;
    await product.save();
    cartProduct.cart = await cart.save();
    const savedCartProduct = await cartProduct.save();
    return savedCartProduct;
  }

  async updateCartAndProduct(cart: Cart, product: Product, quantity: number) {

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
      await this.productTagRepository.delete(product.productTags[i].id);
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
