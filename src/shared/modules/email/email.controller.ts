import { Body, Controller, Post } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { ContactMessageDto } from '../../dto/contact-message.dto';

@Controller('email')
export class EmailController {

  constructor(private emailSenderService: EmailSenderService) {
  }

  @Post('contact')
  contactMessage(@Body() contactMessageDto: ContactMessageDto) {
    return this.emailSenderService.sendContactMessage(contactMessageDto);
  }
}
