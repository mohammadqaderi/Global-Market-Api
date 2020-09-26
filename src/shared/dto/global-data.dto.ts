export class GlobalDataDto {
  constructor(
    public users: number,
    public orders: number,
    public invoices: number,
    public payments: number,
    public files: number,
    public categories: number,
    public subCategories: number,
    public products: number,
    public sales: number,
    public carts: number,
    public profiles: number,
    public tags: number,
  ) {
  }
}
