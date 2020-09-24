import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { UserRole } from '../../commons/enums/user-role.enum';


@Controller('invoices')
export class InvoiceController {

  constructor(private invoiceService: InvoiceService) {
  }

  @Get('all')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getAllInvoices() {
    return this.invoiceService.getAllInvoices();
  }

  @Get('user')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(UserRole.USER)
  getUserInvoices(@GetAuthenticatedUser() user: User) {
    return this.invoiceService.getUserInvoices(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles(UserRole.USER, UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.getInvoiceById(id);
  }

}
