import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';


@Controller('invoices')
export class InvoiceController {

  constructor(private invoiceService: InvoiceService) {
  }

  @Get('all')
  getAllInvoices() {
    return this.invoiceService.getAllInvoices();
  }

  @Get('user')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
  getUserInvoices(@GetAuthenticatedUser() user: User) {
    return this.invoiceService.getUserInvoices(user);
  }

  @Get(':id')
  getInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.getInvoiceById(id);
  }

}
