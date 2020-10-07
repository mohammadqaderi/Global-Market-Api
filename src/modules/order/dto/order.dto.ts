import { BillingAddress } from '../../../commons/classes/billing-address';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({
    type: Object,
    name: 'billingAddress',
    description: `
        This is the price of the product, you must enter the price of the product as shown on the product label,
        Example: 
        {
          country: Jordan,
          city: Amman,
          currentAddress: University Street 
        }
    `,
    required: true,
    title: 'Billing Address',
  })
  billingAddress: BillingAddress;
}
