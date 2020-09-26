import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { EmailSenderService } from '../email/email-sender.service';
import { AwsController } from './aws.controller';


@Module({
  controllers: [AwsController],
  providers: [AwsService, EmailSenderService],
  exports: [AwsService, EmailSenderService],
})
export class AwsModule {

}
