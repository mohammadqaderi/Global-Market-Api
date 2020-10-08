import { Module } from '@nestjs/common';
import { MainModules } from './commons/constants/modules';
@Module({
  imports: MainModules,
})
export class AppModule {

}

