import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../commons/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from './entities/user.entity';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { EditRolesDto } from './dto/edit-roles.dto';
import { UserRole } from '../../commons/enums/user-role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('register/user')
  @ApiBody({ type: AuthCredentialsDto, required: true })
  signUpUser(@Body() authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.signUpUser(authCredentialsDto);
  }

  @Post('register/admin')
  @ApiBody({ type: AuthCredentialsDto, required: true })
  signUpAdmin(@Body() authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.signUpAdmin(authCredentialsDto);
  }

  @Get('email/send-email-verification/:email')
  @ApiParam({ name: 'email', type: String, required: true, example: 'mohammad@gmail.com' })
  async sendEmailVerification(@Param('email') email: string) {
    await this.authService.createEmailToken(email);
    return this.authService.sendEmailVerification(email);
  }

  @Get('email/verify/:token')
  @ApiParam({ name: 'token', type: String, required: true })
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }


  @Post('login/user')
  @ApiBody({ type: EmailLoginDto, required: true })
  signInUser(@Body() emailLoginDto: EmailLoginDto) {
    return this.authService.signInUser(emailLoginDto);
  }


  @Get('email/forgot-password/:email')
  @ApiParam({ name: 'email', type: String, required: true })
  sendEmailForgotPassword(@Param('email') email: string) {
    return this.authService.sendEmailForgottenPassword(email);
  }

  @Post('email/reset-password')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN, UserRole.USER)
  @ApiBody({ type: ResetPasswordDto, required: true })
  setNewPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.setNewPassword(resetPasswordDto);
  }


  @Delete('delete-user-account')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(UserRole.USER)
  deleteUserAccount(@GetAuthenticatedUser() user: User) {
    return this.authService.deleteUserAccount(user);
  }

  @Get('check-username/:username')
  @ApiParam({ name: 'username', type: String, required: true })
  isValidUsername(@Param('username') username: string) {
    return this.authService.isValidUsername(username);
  }


  @Post('login/admin')
  @ApiBody({ type: EmailLoginDto, required: true })
  signInAdmin(@Body() emailLoginDto: EmailLoginDto) {
    return this.authService.signInAdmin(emailLoginDto);
  }

  @Get('system-users')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.WEAK_ADMIN)
  getSystemUsers() {
    return this.authService.getSystemUsers();
  }

  @Get('users/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUserById(id);
  }

  @Put('edit-user-roles/:userId')
  @ApiParam({ name: 'userId', type: String, required: true })
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(UserRole.SUPER_ADMIN)
  editUserRoles(@Param('userId', ParseIntPipe) userId: number, @Body() roles: EditRolesDto) {
    return this.authService.editUserRoles(userId, roles);
  }


}
