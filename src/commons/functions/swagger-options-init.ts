import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from '../../modules/auth/auth.module';
import { ProfileModule } from '../../modules/profile/profile.module';
import { CartModule } from '../../modules/cart/cart.module';
import { CategoryModule } from '../../modules/category/category.module';
import { ProductModule } from '../../modules/product/product.module';
import { TagModule } from '../../modules/tag/tag.module';
import { PaymentModule } from '../../modules/payment/payment.module';
import { OrderModule } from '../../modules/order/order.module';
import { InvoiceModule } from '../../modules/invoice/invoice.module';

interface DocumentData {
  title: string;
  description: string;
  tags: string;
}

export function SwaggerOptionsInit(app: any) {
  const options1 = buildDocument({
    title: 'Auth Module',
    description: 'Auth Module description',
    tags: 'entities,users, auth, strategies, jwt',
  });

  generateDoc(app, options1, AuthModule, 'api/auth');

  // End of Options1


  const options2 = buildDocument({
    title: 'Profile Module',
    description: 'These keywords and tags are within the domain of Profile Module',
    tags: 'profiles',
  });

  generateDoc(app, options2, ProfileModule, 'api/profiles');

  // End of Options2


  const options3 = buildDocument({
    title: 'Cart Module',
    description: 'Cart Module description',
    tags: 'cart',
  });
  generateDoc(app, options3, CartModule, 'api/cart');

  // End of Options3

  const options4 = buildDocument({
    title: 'Category Module',
    description: 'Category Module description',
    tags: 'category, sub-category, category-tag',
  });
  generateDoc(app, options4, CategoryModule, 'api/categories');

  // End of Options4

  const options5 = buildDocument({
    title: 'Product Module',
    description: 'Product Module description',
    tags: 'product, product-tags',
  });
  generateDoc(app, options5, ProductModule, 'api/products');

  // End of Options5


  const options6 = buildDocument({
    title: 'Tag Module',
    description: 'Tag Module description',
    tags: 'tags',
  });
  generateDoc(app, options6, TagModule, 'api/tags');

  // End of Options6


  const options7 = buildDocument({
    title: 'Payment Module',
    description: 'Payment Module description',
    tags: 'payments',
  });
  generateDoc(app, options7, PaymentModule, 'api/payments');

  // End of Options7

  const options8 = buildDocument({
    title: 'Order Module',
    description: 'Order Module description',
    tags: 'orders, order-item',
  });
  generateDoc(app, options8, OrderModule, 'api/orders');
  // End of Options8


  const options9 = buildDocument({
    title: 'Invoice Module',
    description: 'Invoice Module description',
    tags: 'invoices',
  });
  generateDoc(app, options9, InvoiceModule, 'api/invoices');
  // End of Options9

}

function buildDocument(data: DocumentData) {
  const { title, description, tags } = data;
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addTag(tags, `
     These keywords and tags are within the domain of Auth Module`)
    .setLicense('Mohammad Qaderi', null)
    .build();
}

function generateDoc(app, options, moduleName, path) {
  const document = SwaggerModule.createDocument(app, options, {
    include: [moduleName],
  });
  SwaggerModule.setup(path, app, document);
}
