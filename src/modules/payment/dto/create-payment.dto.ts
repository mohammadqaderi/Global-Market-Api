import { PaymentMethod } from '../../../commons/enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    enum: [PaymentMethod.CASH_ON_DELIVERY, PaymentMethod.MASTERCARD, PaymentMethod.MASTERCARD, PaymentMethod.VISA],
    enumName: 'paymentMethod',
    name: 'paymentMethod',
    description: `
        This is the method that user will use to make a purchase process when he checkout his cart,
        it may be VISA, MASTERCARD, PAY-PAL, etc.. 
    `,
    required: true,
    title: 'Payment Method',
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    type: Object,
    name: 'stripeData',
    description: `
        This is the content of the payment process, you must fill your card data,
        and the amount of your invoice
        Example: 
        {
          amount: 300,
          source: 'token_secret_key',
          description: 'this is the second payment per day' 
        }
    `,
    required: true,
    title: 'Stripe Data',
  })
  stripeData: {
    amount: number,
    source: any,
    description: string
  };
}
