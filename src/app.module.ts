import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AwsModule } from './shared/modules/aws/aws.module';
import { NodemailerDrivers, NodemailerModule, NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { CartModule } from './modules/cart/cart.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TagModule } from './modules/tag/tag.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EmailModule } from './shared/modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(Config.DbConfig as TypeOrmModuleOptions),
    NodemailerModule.forRoot(
      {
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'mqaderi44@gmail.com',
            pass: 'zfflxrhqnncoebuh',
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      } as NodemailerOptions<NodemailerDrivers.SMTP>),
    AuthModule,
    ProfileModule,
    AwsModule,
    CartModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    InvoiceModule,
    TagModule,
    PaymentModule,
    EmailModule,
  ],
})

export class AppModule {

}

