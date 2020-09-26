import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Invoice } from './invoice.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import { OrderService } from '../order/order.service';


@Injectable()
export class InvoiceService {
  constructor(@InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
              private orderService: OrderService) {
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async getTotalInvoices() {
    return await this.invoiceRepository.createQueryBuilder().getCount();
  }

  async getUserInvoices(user: User): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        userId: user.id,
      },
    });
  }

  async getInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
    });
    if (!invoice) {
      NotFound('Invoice', id);
    }
    return invoice;
  }

  async createInvoice(user: User, order: Order): Promise<Invoice> {
    const invoice = new Invoice();
    invoice.user = user;
    const today = new Date();
    invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    invoice.paymentDate = today;
    invoice.order = order;
    let totalAmount = 0;
    const orderItems = await this.orderService.getOrderItems(order.id);
    console.log(orderItems);
    for (let i = 0; i < orderItems.length; i++) {
      totalAmount += orderItems[i].unitPrice;
    }
    invoice.total = totalAmount;
    invoice.number = uuidv4();
    const newInvoice = await invoice.save();
    return newInvoice;
  }
}
