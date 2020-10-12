import { ApiProperty } from '@nestjs/swagger';

export class NotificationPayloadDto {
  @ApiProperty({
    type: String,
    name: 'title',
    description: 'This is the mame of the notification',
    required: true,
    title: 'Title',
  })
  title: string;
  @ApiProperty({
    type: String,
    name: 'htmlBody',
    description: 'This is the content of the notification, on html tags signature',
    required: true,
    title: 'Html Body',
  })
  htmlBody: string;
  @ApiProperty({
    type: String,
    name: 'plainText',
    description: 'This is the content of the notification, but without html tags',
    required: true,
    title: 'Plaint text',
  })
  plainText: string;
}
