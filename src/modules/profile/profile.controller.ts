import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { ProfileService } from './profile.service';
import { UserRole } from '../../commons/enums/user-role.enum';


@UseGuards(AuthGuard(), AcceptedAuthGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN, UserRole.USER)
@Controller('profiles')
export class ProfileController {

  constructor(private profileService: ProfileService) {
  }

  @Post('create-profile')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  createProfile(@GetAuthenticatedUser() user: User,
                @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createUserProfile(user, createProfileDto);
  }

  @Get('user-profile')
  getUserProfile(@GetAuthenticatedUser() user: User) {
    return this.profileService.getProfileData(user);
  }

  @Post('user-profile/set-profile-image/:folderName/:subFolder')
  @UseInterceptors(FileInterceptor('image'))
  setProfileImage(@GetAuthenticatedUser() user: User,
                  @Param('folderName') folderName: string,
                  @Param('subFolder') subFolder: string,
                  @UploadedFile() image: any) {
    return this.profileService.setProfileImage(user, folderName, subFolder, image);
  }

  @Patch('user-profile/change-profile-image/:folderName/:subFolder')
  @UseInterceptors(FileInterceptor('image'))
  changeProfileImage(@GetAuthenticatedUser() user: User,
                     @Param('folderName') folderName: string,
                     @Param('subFolder') subFolder: string,
                     @UploadedFile() image: any) {
    return this.profileService.changeProfileImage(user, folderName, subFolder, image);
  }


  @Delete('user-profile/delete-profile-image')
  deleteProfileImage(@GetAuthenticatedUser() user: User) {
    return this.profileService.deleteProfileImage(user);
  }

  @Put('user-profile/edit-profile')
  editProfile(@GetAuthenticatedUser() user: User,
              @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.editProfile(user, createProfileDto);
  }
}
