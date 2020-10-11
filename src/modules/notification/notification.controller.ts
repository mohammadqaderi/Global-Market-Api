import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { NotificationPayloadDto } from './notification-payload.dto';
import { NotificationService } from './notification.service';
import { UserRole } from '../../commons/enums/user-role.enum';

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


  // @Get('subscribers/subscriber-notifications')
  // @UseGuards(AuthGuard(), UserAuthGuard)
  // @Roles(UserRole.USER)
  // getSubscriberNotifications(@GetAuthenticatedUser() user: User) {
  //   if (user.subscriberId) {
  //     return this.notificationService.getSubscriberNotifications(user.subscriberId);
  //   } else {
  //     return null;
  //   }
  // }

  @Get('subscribers/:id')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getSubscriberById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getSubscriberById(id);
  }


  @Post('subscribers/new')
  newSubscriber(@Query('email') email: string, @Body() subscriber: any) {
    return this.notificationService.newSubscriber(email, subscriber);
  }

  @Post('send-notification')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  sendNotification(@Body() notificationPayloadDto: NotificationPayloadDto) {
    return this.notificationService.sendNewNotification(notificationPayloadDto);
  }
}
