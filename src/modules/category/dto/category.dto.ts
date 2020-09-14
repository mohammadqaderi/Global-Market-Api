export class CategoryDto {
  name: string;
  description: string;
  icon: string;
}

export class SubCategoryDto {
  name: string;
  description: string;
  icon: string;
  references: number[];
}
