import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from '../invoice/invoice.service';
import { Order } from '../order/entities/order.entity';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import { InjectStripe } from 'nestjs-stripe';
import { PaymentMethod } from '../../commons/enums/payment-method.enum';
import NotFound = ThrowErrors.NotFound;
import { Config } from '../../config';
import StripeConfig = Config.StripeConfig;
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  stripe: Stripe;

  constructor(@InjectRepository(Payment) public readonly paymentRepository: Repository<Payment>,
              private invoiceService: InvoiceService,
              @InjectStripe() private readonly stripeClient: Stripe) {
    this.stripe = new Stripe(StripeConfig.secretKey, {
      apiVersion: '2020-08-27',
    });
  }

  async playWithStripe() {
    return this.stripeClient.customers.list({});
  }

  async generatePaymentInvoice(user: User, stripeData) {
    let customer: Stripe.Customer = null;
    if (user.stripeId) {
      customer = await this.stripe.customers.retrieve(user.stripeId) as Stripe.Customer;
      await this.createInvoice(customer, stripeData);
    } else {
      const params: Stripe.CustomerCreateParams = {
        description: 'test customer',
        email: user.email,
      };
      customer = await this.stripe.customers.create(params);
      user.stripeId = customer.id;
      await this.createInvoice(customer, stripeData);
    }
    return customer.id;
  }

  async createInvoice(customer: Stripe.Customer, stripeData) {
    const { amount, description } = stripeData;
    const invoiceItem = await this.stripe.invoiceItems.create({
      customer: customer.id,
      amount,
      description,
      currency: 'usd',
    });
    await this.stripe.invoices.create({
      collection_method: 'send_invoice',
      days_until_due: 100,
      customer: invoiceItem.customer as string,
    });
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

  async setUserStripeId(user: User, data: { customerId: string }) {
    if (!user.stripeId) {
      const { customerId } = data;
      user.stripeId = customerId;
      const savedUser = await user.save();
      return savedUser;
    } else {
      return user;
    }
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
    const customerId = await this.generatePaymentInvoice(user, stripeData);
    return { payment: newPayment, invoice: invoice, customerId };
  };
}
