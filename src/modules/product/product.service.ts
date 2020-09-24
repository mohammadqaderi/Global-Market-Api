import { forwardRef, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
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
import { ManageProductImages } from '../../commons/interfaces/manage-product-images.interface';


@Injectable()
export class ProductService {

  constructor(private readonly productRepository: ProductRepository,
              @InjectRepository(ProductTag) public readonly productTagRepository: Repository<ProductTag>,
              private awsService: AwsService,
              @Inject(forwardRef(() => CartService)) private cartService: CartService,
              @Inject(forwardRef(() => TagService)) private tagService: TagService) {
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
    const { name, references, price, quantity, description } = updateProductDto;
    if (product.name) {
      product.name = name;
    }
    if (product.description) {
      product.description = description;
    }

    if (product.quantity) {
      product.quantity = quantity;
    }
    if (product.quantity === 0) {
      product.inStock = false;
    }
    if (product.price) {
      product.price = price;
    }
    if (product.references) {
      product.references = references;
    }
    product.updatedAt = new Date();
    const updatedProduct = await product.save();
    return updatedProduct;
  }

  async manageProductImages(id: number, data: ManageProductImages,
                            type: string,
                            folderName: string,
                            subFolder: string) {
    const { newImages, removedImages } = data;
    const product = await this.getProductById(id);
    if (removedImages) {
      for (let i = 0; i < removedImages.length; i++) {
        await this.awsService.fileDelete(removedImages[i]);
        product.images = product.images.filter(img => img !== removedImages[i]);
      }
      console.log(product.images);
    }
    if (newImages) {
      for (let i = 0; i < newImages.length; i++) {
        const image = await this.awsService.fileUpload(newImages[i],
          { folderName: folderName, subFolder: subFolder, type: type });
        product.images = [...product.images, image];
      }
    }
    const savedProductStatus = await product.save();
    return savedProductStatus;

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

  async addTagsToProduct(productId: number, payload: InsertTagDto): Promise<ProductTag[]> {
    const product = await this.getProductById(productId);
    let addedProductTags: ProductTag[] = [];
    for (let i = 0; i < payload.tags.length; i++) {
      const productTag = new ProductTag();
      productTag.product = product;
      const tag = await this.tagService.getTagById(payload.tags[i]);
      productTag.tagId = tag.id;
      productTag.name = tag.name;
      const newProductTag = await productTag.save();
      addedProductTags = [...addedProductTags, newProductTag];
    }
    return addedProductTags;
  }

  async removeTagsFromProduct(id: number, payload: InsertTagDto): Promise<Product> {

    const product = await this.getProductById(id);
    for (let i = 0; i < payload.tags.length; i++) {
      const productTag = product.productTags.find(ct => ct.id === payload.tags[i]);
      if (productTag) {
        await this.productTagRepository.delete(productTag.id);
        product.productTags = product.productTags.filter(pTag => pTag.id !== productTag.id);
      }
    }
    return await product.save();
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
