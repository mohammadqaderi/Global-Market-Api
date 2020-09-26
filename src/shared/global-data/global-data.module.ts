import { Module } from '@nestjs/common';
import { GlobalDataController } from './global-data.controller';
import { GlobalDataService } from './global-data.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { ProfileModule } from '../../modules/profile/profile.module';
import { AwsModule } from '../modules/aws/aws.module';
import { CartModule } from '../../modules/cart/cart.module';
import { ProductModule } from '../../modules/product/product.module';
import { CategoryModule } from '../../modules/category/category.module';
import { OrderModule } from '../../modules/order/order.module';
import { InvoiceModule } from '../../modules/invoice/invoice.module';
import { TagModule } from '../../modules/tag/tag.module';
import { PaymentModule } from '../../modules/payment/payment.module';


@Module({
  imports: [
    AuthModule,
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    ProfileModule,
    AwsModule,
    CartModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    InvoiceModule,
    TagModule,
    PaymentModule,
  ],
  controllers: [GlobalDataController],
  providers: [GlobalDataService],
})
export class GlobalDataModule {

}
