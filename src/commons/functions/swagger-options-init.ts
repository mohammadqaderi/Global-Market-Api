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
import { NotificationModule } from '../../modules/notification/notification.module';

interface DocumentData {
  title: string;
  description: string;
  tags: string;
}

export function SwaggerOptionsInit(app: any) {
  const options1 = buildDocument({
    title: 'Auth Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/profiles">Profile</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'entities,users, auth, strategies, jwt',
  });

  generateDoc(app, options1, AuthModule, 'api/auth');

  // End of Options1


  const options2 = buildDocument({
    title: 'Profile Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'profiles',
  });

  generateDoc(app, options2, ProfileModule, 'api/profiles');

  // End of Options2


  const options3 = buildDocument({
    title: 'Cart Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'cart',
  });
  generateDoc(app, options3, CartModule, 'api/cart');

  // End of Options3

  const options4 = buildDocument({
    title: 'Category Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'category, sub-category, category-tag',
  });
  generateDoc(app, options4, CategoryModule, 'api/categories');

  // End of Options4

  const options5 = buildDocument({
    title: 'Product Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'product, product-tags',
  });
  generateDoc(app, options5, ProductModule, 'api/products');

  // End of Options5


  const options6 = buildDocument({
    title: 'Tag Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'tags',
  });
  generateDoc(app, options6, TagModule, 'api/tags');

  // End of Options6


  const options7 = buildDocument({
    title: 'Payment Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'payments',
  });
  generateDoc(app, options7, PaymentModule, 'api/payments');

  // End of Options7

  const options8 = buildDocument({
    title: 'Order Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/invoices">Invoices</a></p>',
    tags: 'orders, order-item',
  });
  generateDoc(app, options8, OrderModule, 'api/orders');
  // End of Options8


  const options9 = buildDocument({
    title: 'Invoice Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>',
    tags: 'invoices',
  });
  generateDoc(app, options9, InvoiceModule, 'api/invoices');
  // End of Options9

  const options10 = buildDocument({
    title: 'Notifications Module',
    description: '<h3>Endpoints in this system</h3>' +
      '<p><a style="text-decoration: none;" href="http://localhost:3000/api/auth">Auth</a></p>' +
      ' <p><a style="text-decoration: none;"  href="http://localhost:3000/api/profile">Profile</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/categories">Categories</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/products">Products</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/tags">Tags</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/payments">Payments</a></p>'
      + '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/orders">Orders</a></p>' +
      '<p><a style="text-decoration: none;"  href="http://localhost:3000/api/cart">Cart</a></p>',
    tags: 'invoices',
  });
  generateDoc(app, options10, NotificationModule, 'api/notifications');
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
