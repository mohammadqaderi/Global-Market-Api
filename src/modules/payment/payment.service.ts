import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from '../invoice/invoice.service';
import { Order } from '../order/entities/order.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import { Stripe } from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { PaymentMethod } from '../../commons/enums/payment-method.enum';
import NotFound = ThrowErrors.NotFound;

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) public readonly paymentRepository: Repository<Payment>,
              private invoiceService: InvoiceService,
              @InjectStripe() private readonly stripeClient: Stripe) {
  }

  async playWithStripe() {
    return this.stripeClient.customers.list({});
  }

  async generatePaymentInvoice(user: User, stripeData) {
    const { amount, source, description } = stripeData;
    let customer = null;
    if (user.stripeId) {
      customer = await this.stripeClient.customers.retrieve(user.stripeId);
    } else {
      console.log(user.profile);
      customer = await this.stripeClient.customers.create({ email: user.email });
    }
    const payment = await this.stripeClient.charges.create({
      amount,
      currency: 'usd',
      description,
      source,
      customer: customer.id,
    });
    console.log(payment);
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async getTotalPayments() {
    return await this.paymentRepository.createQueryBuilder().getCount();
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
    const { paymentMethod, stripeData } = createPaymentDto;
    payment.paymentMethod = paymentMethod || PaymentMethod.VISA;
    payment.user = user;
    const invoice = await this.invoiceService.createInvoice(user, order);
    payment.amount = invoice.total;
    payment.invoice = invoice;
    const newPayment = await payment.save();
    await this.generatePaymentInvoice(user, stripeData);
    return { payment: newPayment, invoice: invoice };
  };
}
