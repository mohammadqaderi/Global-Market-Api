import { ApiProperty } from '@nestjs/swagger';

export class InsertTagDto {
  @ApiProperty({
    type: [Number],
    isArray: true,
    name: 'tags',
    description: `
        This is array of tags, but careful, you must insert the ids inside the array, not the names of the tags
        to be inserted either on product or category
    `,
    required: true,
    title: 'Tags',
  })
  tags: number[];
}
