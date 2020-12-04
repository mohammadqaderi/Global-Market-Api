import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { InsertTagDto } from '../../shared/dto/insert-tag.dto';
import { ProductTag } from './entities/product-tag.entity';
import { Product } from './entities/product.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import { UpdateProductDto } from './dto/update-product.dto';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { TagService } from '../tag/tag.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { CartProduct } from '../cart/entities/cart-product.entity';
import { CreateCartProductDto } from '../cart/dto/create-cart-product.dto';
import { ManageProductImages } from '../../commons/interfaces/manage-product-images.interface';
import { ProductsCustomFilterDto } from './dto/products-custom-filter.dto';
import NotFound = ThrowErrors.NotFound;

@Injectable()
export class ProductService {

  constructor(public readonly productRepository: ProductRepository,
              @InjectRepository(ProductTag) public readonly productTagRepository: Repository<ProductTag>,
              private awsService: AwsService,
              @Inject(forwardRef(() => CartService)) private cartService: CartService,
              @Inject(forwardRef(() => TagService)) private tagService: TagService) {
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getShopProducts(page: number, limit: number) {
    return await this.productRepository.getShopProducts(page, limit);
  }

  async getTotalProducts() {
    return await this.productRepository.getTotalProducts();
  }

  async searchByName(name: string, page: number, limit: number) {
    return await this.productRepository.searchByName(name, page, limit);
  }

  async getProductsNames(name) {
    return await this.productRepository.getProductsNames(name);
  }

  async customFilter(productsCustomFilterDto: ProductsCustomFilterDto) {
    return await this.productRepository.customFilter(productsCustomFilterDto);
  }

  async getProductsTags() {
    const productTags = await this.productTagRepository.find();
    let uniqueArray: ProductTag[] = [];
    for (let i = 0; i < productTags.length; i++) {
      const item = uniqueArray.find(item => item.name === productTags[i].name);
      if (!item) {
        uniqueArray = [...uniqueArray, productTags[i]];
      }
    }
    return uniqueArray;
  }


  async getMixLatestProduct() {
    return await this.productRepository.getMixLatestProduct();
  }

  async getMostSalesProducts() {
    return await this.productRepository.getMostSalesProducts();
  }


  async getTotalSales() {
    return await this.productRepository.getTotalSales();
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

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(id);
    const { name, references, currentPrice, quantity, description } = updateProductDto;
    product.name = name;
    product.description = description;
    product.quantity = quantity;
    if (product.quantity === 0) {
      product.inStock = false;
    }
    if (currentPrice) {
      product.previousPrice = product.currentPrice;
      product.currentPrice = currentPrice;
    }
    product.references = references;
    product.updatedAt = new Date(Date.now());
    const updatedProduct = await product.save();
    return updatedProduct;
  }

  async getMatchingByNames(name: string) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    const searchResults
      = await queryBuilder.leftJoinAndSelect('product.productTags', 'productTag')
      .select(['product.id', 'product.name',
        'product.images', 'product.currentPrice',
        'product.previousPrice', 'product.subCategoryId'])
      .where('productTag.name LIKE :name', { name: name })
      .getMany();
    return searchResults;
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
    const cartProductIndex = cart.cartProducts.findIndex(cp => cp.productId === product.id);
    if (cartProductIndex >= 0) {
      let currentCartProduct = cart.cartProducts[cartProductIndex];
      currentCartProduct.quantity = currentCartProduct.quantity + quantity;
      currentCartProduct.totalPrice = product.currentPrice * currentCartProduct.quantity;
      const savedCartProduct = await currentCartProduct.save();
      cart.cartProducts[cartProductIndex] = savedCartProduct;
      await cart.save();
      return await cart.save();
    } else {
      const cartProduct = new CartProduct();
      cartProduct.productId = productId;
      cartProduct.image = product.images[0];
      cartProduct.quantity = quantity;
      cartProduct.totalPrice = product.currentPrice * quantity;
      cartProduct.maxPush = product.quantity;
      cartProduct.name = product.name;
      cart.totalItems += 1;
      cartProduct.cart = await cart.save();
      await cartProduct.save();
      return await this.cartService.getUserCart(null, cart.id);

    }
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

  async fetchProductsTagsNames() {
    const query = this.productTagRepository.createQueryBuilder('productTag');
    const productTags = await query.select('productTag.name').distinct(true).getMany();
    return productTags;
  }
}
