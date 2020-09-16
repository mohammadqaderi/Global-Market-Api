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
}
