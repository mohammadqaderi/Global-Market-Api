import { Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { ProfileService } from '../../modules/profile/profile.service';
import { ProductService } from '../../modules/product/product.service';
import { CartService } from '../../modules/cart/cart.service';
import { CategoryService } from '../../modules/category/services/category.service';
import { SubCategoryService } from '../../modules/category/services/sub-category.service';
import { TagService } from '../../modules/tag/tag.service';
import { AwsService } from '../modules/aws/aws.service';
import { PaymentService } from '../../modules/payment/payment.service';
import { InvoiceService } from '../../modules/invoice/invoice.service';
import { OrderService } from '../../modules/order/order.service';
import { GlobalDataDto } from '../dto/global-data.dto';


@Injectable()
export class GlobalDataService {
  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private productService: ProductService,
              private cartService: CartService,
              private categoryService: CategoryService,
              private subCategoryService: SubCategoryService,
              private tagService: TagService,
              private paymentService: PaymentService,
              private invoiceService: InvoiceService,
              private orderService: OrderService,
              private awsService: AwsService) {
  }


  async getGlobalData(): Promise<GlobalDataDto> {
    const totalOrders = await this.orderService.getTotalOrders();
    const totalUsers = await this.authService.getTotalUsers();
    const totalCarts = await this.cartService.getTotalCarts();
    const totalPayments = await this.paymentService.getTotalPayments();
    const totalProducts = await this.productService.getTotalProducts();
    const sales = await this.productService.getTotalSales();
    const totalProfiles = await this.profileService.getTotalProfiles();
    const totalTags = await this.tagService.getTotalTags();
    const totalCategories = await this.categoryService.getTotalCategories();
    const totalSubCategories = await this.subCategoryService.getTotalSubCategories();
    const { Contents } = await this.awsService.getAllFiles() as any;
    const totalInvoices = await this.invoiceService.getTotalInvoices();
    return new GlobalDataDto(totalUsers,
      totalOrders, totalInvoices, totalPayments,
      Contents.length, totalCategories,
      totalSubCategories, totalProducts,
      sales, totalCarts,
      totalProfiles, totalTags);
  }
}
