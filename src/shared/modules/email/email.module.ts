import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { EmailController } from './email.controller';


@Module({
  controllers: [EmailController],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailModule {

}
