import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'This is the Name of the Category',
    required: true,
    title: 'Name',
  })
  name: string;
  @ApiProperty({
    type: String,
    name: 'description',
    description: 'This is the description of the Category',
    required: true,
    title: 'Description',
  })
  description: string;

}

export class SubCategoryDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'This is the Name of the Sub Category',
    required: true,
    title: 'Name',
  })
  name: string;
  @ApiProperty({
    type: String,
    name: 'description',
    description: 'This is the description of the Sub Category',
    required: true,
    title: 'Description',
  })
  description: string;

  @ApiProperty({
    type: [Number],
    isArray: true,
    name: 'references',
    description: 'These are the list of sub category references, it may be related to this sub category,' +
      'specify the id of each sub category that is related to this product',
    required: true,
    title: 'References',
  })
  references: number[];
}
