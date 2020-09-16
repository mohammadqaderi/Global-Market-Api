import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PaymentService } from './payment.service';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';


@Controller('payments')
export class PaymentController {

  constructor(private paymentService: PaymentService) {
  }

  @Get('all')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.USER)
  getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Get('user')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
  getUserPayments(@GetAuthenticatedUser() user: User) {
    return this.paymentService.getUserPayments(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles(Role.USER)
  getPaymentById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.getPaymentById(id);
  }
}
