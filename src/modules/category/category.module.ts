import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategoryTag } from './entities/sub-category-tag.entity';
import { SubCategoryController } from './controllers/sub-category.controller';
import { SubCategoryService } from './services/sub-category.service';
import { TagModule } from '../tag/tag.module';
import { ProductModule } from '../product/product.module';
import { SubCategoryRepository } from './repositories/sub-category.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategoryRepository, SubCategoryTag]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), AwsModule, forwardRef(() => TagModule),forwardRef(() => ProductModule)],
  controllers: [CategoryController, SubCategoryController],
  providers: [CategoryService, SubCategoryService],
  exports: [SubCategoryService]
})
export class CategoryModule {

}
