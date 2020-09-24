import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag])
    , PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), forwardRef(() => ProductModule), forwardRef(() => CategoryModule)],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {

}
