import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from './entities/user.entity';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('register')
  @ApiBody({ type: AuthCredentialsDto, required: true })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.signUp(authCredentialsDto);
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
  @ApiBody({ type: ResetPasswordDto, required: true })
  setNewPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.setNewPassword(resetPasswordDto);
  }


  @Delete('delete-user-account')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles(Role.USER)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  editUserRoles(@Param('userId', ParseIntPipe) userId: number, @Body() roles: Role[]) {
    return this.authService.editUserRoles(userId, roles);
  }


}
