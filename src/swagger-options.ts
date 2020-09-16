import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { TagModule } from './modules/tag/tag.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

export function SwaggerOptionsInit(app: any) {
  const options1 = new DocumentBuilder()
    .setTitle('Auth Module')
    .setDescription('Auth Module description')
    .setVersion('1.0')
    .addTag(`entities,users, auth, strategies, jwt`, `
     These keywords and tags are within the domain of Auth Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const authDocument = SwaggerModule.createDocument(app, options1, {
    include: [AuthModule],
  });
  SwaggerModule.setup('api/auth', app, authDocument);

  // End of Options1

  const options2 = new DocumentBuilder()
    .setTitle('Profile Module')
    .setDescription('Profile Module description')
    .setVersion('1.0')
    .addTag(`profiles`, `
     These keywords and tags are within the domain of Profile Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const profileDocument = SwaggerModule.createDocument(app, options2, {
    include: [ProfileModule],
  });
  SwaggerModule.setup('api/profiles', app, profileDocument);

  // End of Options2

  const options3 = new DocumentBuilder()
    .setTitle('Cart Module')
    .setDescription('Cart Module description')
    .setVersion('1.0')
    .addTag(`carts, cart-product`, `
     These keywords and tags are within the domain of Cart Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const cartDocument = SwaggerModule.createDocument(app, options3, {
    include: [CartModule],
  });
  SwaggerModule.setup('api/cart', app, cartDocument);

  // End of Options3

  const options4 = new DocumentBuilder()
    .setTitle('Category Module')
    .setDescription('Auth Module description')
    .setVersion('1.0')
    .addTag(`category, sub-category, category-tag`, `
     These keywords and tags are within the domain of Category Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const categoryDocument = SwaggerModule.createDocument(app, options4, {
    include: [CategoryModule],
  });
  SwaggerModule.setup('api/categories', app, categoryDocument);

  // End of Options4

  const options5 = new DocumentBuilder()
    .setTitle('Product Module')
    .setDescription('Product Module description')
    .setVersion('1.0')
    .addTag(`product, product-tags`, `
     These keywords and tags are within the domain of Product Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const productDocument = SwaggerModule.createDocument(app, options5, {
    include: [ProductModule],
  });
  SwaggerModule.setup('api/products', app, productDocument);

  // End of Options5

  const options6 = new DocumentBuilder()
    .setTitle('Tag Module')
    .setDescription('Tag Module description')
    .setVersion('1.0')
    .addTag(`tags`, `
     These keywords and tags are within the domain of Tag Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const tagsDocument = SwaggerModule.createDocument(app, options6, {
    include: [TagModule],
  });
  SwaggerModule.setup('api/tags', app, tagsDocument);

  // End of Options6

  const options7 = new DocumentBuilder()
    .setTitle('Payment Module')
    .setDescription('Payment Module description')
    .setVersion('1.0')
    .addTag(`payments`, `
     These keywords and tags are within the domain of Payment Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const paymentsDocument = SwaggerModule.createDocument(app, options7, {
    include: [PaymentModule],
  });
  SwaggerModule.setup('api/payments', app, paymentsDocument);

  // End of Options7

  const options8 = new DocumentBuilder()
    .setTitle('Order Module')
    .setDescription('Order Module description')
    .setVersion('1.0')
    .addTag(`orders, order-item`, `
     These keywords and tags are within the domain of Order Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const ordersDocument = SwaggerModule.createDocument(app, options8, {
    include: [OrderModule],
  });
  SwaggerModule.setup('api/orders', app, ordersDocument);

  // End of Options8

  const options9 = new DocumentBuilder()
    .setTitle('Invoice Module')
    .setDescription('Invoice Module description')
    .setVersion('1.0')
    .addTag(`invoices`, `
     These keywords and tags are within the domain of Invoice Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
  const invoicesDocument = SwaggerModule.createDocument(app, options9, {
    include: [InvoiceModule],
  });
  SwaggerModule.setup('api/invoices', app, invoicesDocument);

  // End of Options9


}
