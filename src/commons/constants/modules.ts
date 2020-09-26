import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Config } from '../../config';
import { NodemailerDrivers, NodemailerModule, NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { AuthModule } from '../../modules/auth/auth.module';
import { ProfileModule } from '../../modules/profile/profile.module';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { CartModule } from '../../modules/cart/cart.module';
import { ProductModule } from '../../modules/product/product.module';
import { CategoryModule } from '../../modules/category/category.module';
import { OrderModule } from '../../modules/order/order.module';
import { InvoiceModule } from '../../modules/invoice/invoice.module';
import { TagModule } from '../../modules/tag/tag.module';
import { PaymentModule } from '../../modules/payment/payment.module';
import { EmailModule } from '../../shared/modules/email/email.module';
import { GlobalDataModule } from '../../shared/global-data/global-data.module';
import { NotificationModule } from '../../modules/notification/notification.module';

export const MainModules = [
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
  GlobalDataModule,
  NotificationModule,
];
