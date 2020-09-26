import { Controller, Get, UseGuards } from '@nestjs/common';
import { GlobalDataService } from './global-data.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { UserRole } from '../../commons/enums/user-role.enum';


@Controller('global-data')
export class GlobalDataController {
  constructor(private gdService: GlobalDataService) {
  }

  @Get()
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getGlobalData() {
    return this.gdService.getGlobalData();
  }
}
