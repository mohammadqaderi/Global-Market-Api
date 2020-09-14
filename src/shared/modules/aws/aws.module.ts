import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { EmailSenderService } from '../email/email-sender.service';


@Module({
  providers: [AwsService, EmailSenderService],
  exports: [AwsService, EmailSenderService],
})
export class AwsModule {

}
