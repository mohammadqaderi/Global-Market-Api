export class UpdateProductDto {
  name: string;
  description: string;
  inStock: boolean;
  quantity: number;
  price: number;
  references: number[];
}
