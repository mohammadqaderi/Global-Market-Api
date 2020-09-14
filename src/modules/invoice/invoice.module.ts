import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './invoice.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Invoice]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    })],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {

}
