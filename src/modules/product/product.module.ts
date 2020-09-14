import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/product-tag.entity';
import { ProductRepository } from './repositories/product.repository';
import { TagModule } from '../tag/tag.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, ProductTag]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), AwsModule, TagModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {

}
