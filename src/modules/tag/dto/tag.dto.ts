import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'This is the Name of the tag',
    required: true,
    title: 'Name',
  })
  name: string;
}
