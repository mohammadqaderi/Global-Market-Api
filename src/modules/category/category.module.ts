import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryTag } from './entities/category-tag.entity';
import { SubCategoryController } from './controllers/sub-category.controller';
import { SubCategoryService } from './services/sub-category.service';
import { SubCategory } from './entities/sub-category.entity';
import { TagModule } from '../tag/tag.module';
import { ProductModule } from '../product/product.module';
import { SubCategoryRepository } from './repositories/sub-category.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategoryRepository, CategoryTag]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), AwsModule, TagModule, ProductModule],
  controllers: [CategoryController, SubCategoryController],
  providers: [CategoryService, SubCategoryService],
})
export class CategoryModule {

}
