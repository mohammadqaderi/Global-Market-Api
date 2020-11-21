import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { NotificationPayloadDto } from './notification-payload.dto';
import { NotificationService } from './notification.service';
import { UserRole } from '../../commons/enums/user-role.enum';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('notifications, subscribers')
@ApiHeader({
  name: 'Authorization',
  description: 'Authorization Token',
})
@Controller('notifications')
export class NotificationController {

  constructor(private notificationService: NotificationService) {
  }

  @Get()
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  @Get('subscribers')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getAllSubscribers() {
    return this.notificationService.getAllSubscribers();
  }


  @Post('subscribers/new')
  @ApiBody({ type: Object, required: true, description: 'browser subscription' })
  newSubscriber(@Body('subscriptionDto') subscriptionDto: any) {
    return this.notificationService.newSubscriber(subscriptionDto);
  }


  @Get('subscribers/:id')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  @ApiParam({ name: 'id', type: Number, required: true, example: '1' })
  getSubscriberById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getSubscriberById(id);
  }

  @Post('send-notification')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  @ApiBody({ type: NotificationPayloadDto, required: true, description: 'title and content' })
  sendNotification(@Body() notificationPayloadDto: NotificationPayloadDto) {
    return this.notificationService.sendNewNotification(notificationPayloadDto);
  }
}
