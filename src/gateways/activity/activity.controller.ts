import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { UserRole } from '../../commons/enums/user-role.enum';


@Controller('activities')
export class ActivityController {

  constructor(private activityRepo: ActivityRepository) {
  }

  @Get()
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  async getActivities(@Query('take', ParseIntPipe) take: number,
                      @Query('skip') skip: number) {
    return await this.activityRepo.getActivities(take, skip);
  }
}
