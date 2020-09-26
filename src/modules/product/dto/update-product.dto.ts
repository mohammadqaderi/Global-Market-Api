import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'This is the Name of the product',
    required: true,
    title: 'Name',
  })
  name: string;

  @ApiProperty({
    type: String,
    name: 'description',
    description: 'This is the description of the tag',
    required: true,
    title: 'Description',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    name: 'inStock',
    description: 'This property determine if the product exist in the store or not',
    required: true,
    title: 'In Stock',
  })
  inStock: boolean;
  @ApiProperty({
    type: Number,
    name: 'quantity',
    description: 'This is the number of this product',
    required: true,
    title: 'Quantity',
  })
  quantity: number;
  @ApiProperty({
    type: Number,
    name: 'price',
    description: `
        This is the current price of the product, you must enter the price of the product as shown on the product label
    `,
    required: true,
    title: 'Product',
  })
  currentPrice: number;

  @ApiProperty({
    type: [Number],
    isArray: true,
    name: 'references',
    description: 'These are the list of product references, and may be related to this product,' +
      'specify the id of each product that is related to this product',
    required: true,
    title: 'References',
  })
  references: number[];
}
