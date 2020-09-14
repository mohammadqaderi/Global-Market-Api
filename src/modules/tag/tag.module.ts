import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag])
    , PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    })],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {

}
