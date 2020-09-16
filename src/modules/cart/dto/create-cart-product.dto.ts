import { ApiProperty } from '@nestjs/swagger';

export class CreateCartProductDto {
  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'This is the quantity of the product that you want to add to the cart',
    required: true,
    title: 'Quantity',
  })
  quantity: number;
}
