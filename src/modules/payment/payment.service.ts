import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from '../invoice/invoice.service';
import { Order } from '../order/entities/order.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;


@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
              private invoiceService: InvoiceService) {
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async getUserPayments(user: User): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: {
        userId: user.id,
      },
    });
  }

  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
      },
    });
    if (!payment) {
      NotFound('Payment', id);
    }
    return payment;
  }

  async createPayment(user: User, createPaymentDto: CreatePaymentDto, order: Order) {
    const payment = new Payment();
    const { paymentMethod } = createPaymentDto;
    payment.paymentMethod = paymentMethod;
    payment.user = user;
    const invoice = await this.invoiceService.createInvoice(user, order);
    payment.amount = invoice.total;
    payment.invoice = invoice;
    const newPayment = await payment.save();
    return { payment: newPayment, invoice: invoice };
  };
}
