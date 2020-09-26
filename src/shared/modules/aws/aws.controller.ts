import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';


@Controller('aws')
export class AwsController {
  constructor(private awsService: AwsService) {
  }

  @Get('any')
  async getObjects() {
    const { Contents } = await this.awsService.getAllFiles() as any;
    return Contents.length;
  }
}
