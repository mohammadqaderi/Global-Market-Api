import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';


@Module({
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailModule {

}
