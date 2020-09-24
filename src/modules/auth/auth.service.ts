import {
  BadRequestException,
  ConflictException, HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { EmailVerification } from './entities/email-verification.entity';
import { Repository } from 'typeorm';
import { EmailLoginDto } from './dto/email-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from '../../commons/interfaces/jwt-payload.interface';
import { ProfileService } from '../profile/profile.service';
import { Config } from '../../config';
import FrontEndKeys = Config.FrontEndKeys;
import NodeMailerOptions = Config.NodeMailerOptions;
import { EmailSenderService } from '../../shared/modules/email/email-sender.service';
import { ThrowErrors } from '../../commons/functions/throw-errors';
import NotFound = ThrowErrors.NotFound;
import * as Verifier from 'email-verifier';
import { EditRolesDto } from './dto/edit-roles.dto';
import { UserRole } from '../../commons/enums/user-role.enum';

@Injectable()
export class AuthService {
  private verifier = new Verifier('at_whgCW1bbw4DtPGPBgMVEfCW8n9rMs');

  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
              @InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
              @InjectRepository(ForgottenPassword) private forgottenPasswordRepo: Repository<ForgottenPassword>,
              private profileService: ProfileService,
              private emailSenderService: EmailSenderService,
              private jwtService: JwtService,
  ) {

  }

  async signUpAdmin(authCredentialsDto: AuthCredentialsDto): Promise<{ admin: User, token: string }> {
    const admin = await this.setUserOrAdminBaseData(authCredentialsDto);
    admin.claims = [UserRole.WEAK_ADMIN];
    const { email } = authCredentialsDto;
    const token = this.generateJwtToken(email);
    return { admin: await admin.save(), token };
  }

  async setUserOrAdminBaseData(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password, email } = authCredentialsDto;
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('You have entered invalid email');
    }
    // if (!(await this.isEmailActivated(email))) {
    //   throw new ConflictException(`Your Email is not valid to use in our environment or other environments, please check if this email is valid to use in its service provider`);
    // }
    const user = new User();
    user.salt = await bcrypt.genSalt();

    if ((await this.isValidUsername(username))) {
      throw new ConflictException(`Username ${username} is not available, please try another one`);
    } else {
      user.username = username;
    }

    if ((await this.checkIfEmailExist(email))) {
      throw new ConflictException(`Email ${email} is not available, please try another one`);
    } else {
      user.email = email;
    }
    user.password = await this.userRepository.hashPassword(password, user.salt);
    user.payments = [];
    user.orders = [];
    user.invoices = [];
    return user;
  }

  async signUpUser(authCredentialsDto: AuthCredentialsDto): Promise<{ user: User, token: string }> {
    const user = await this.setUserOrAdminBaseData(authCredentialsDto);
    const { email } = authCredentialsDto;
    user.claims = [UserRole.USER];
    // await this.createEmailToken(email);
    // await this.sendEmailVerification(email);
    const token = this.generateJwtToken(email);
    return { user: await user.save(), token };
  }

  isEmailActivated(email: string) {
    return new Promise(((resolve, reject) => {
      this.verifier.verify(email, (err, data) => {
        if (err) {
          throw err;
        }
        resolve((data.smtpCheck == 'true'));
      });
    }));

  }


  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }


  async signInUser(emailLoginDto: EmailLoginDto): Promise<{ user: User, token: string }> {
    if (!(await this.isValidEmail(emailLoginDto.email))) {
      throw new BadRequestException('Invalid Email Signature');
    }
    const { email, user } = await this.userRepository.validateUserPassword(emailLoginDto);
    const token = this.generateJwtToken(email);
    return { user, token };
  }

  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query.select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }


  // this method well be used in different methods
  generateJwtToken(email: string) {
    const payload: JwtPayload = { email };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }


  async createEmailToken(email: string) {
    const verifiedEmail = await this.emailVerificationRepo.findOne({ email });
    if (verifiedEmail && ((new Date().getTime() - verifiedEmail.timestamp.getTime()) / 60000) < 15) {
      throw new ConflictException('LOGIN_EMAIL_SENT_RECENTLY');
    } else {
      const newEmailVerification = new EmailVerification();
      newEmailVerification.email = email;
      newEmailVerification.emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
      newEmailVerification.timestamp = new Date();
      await newEmailVerification.save();
      return true;
    }
  }

  async sendEmailVerification(email: string): Promise<any> {
    const verifiedEmail = await this.emailVerificationRepo.findOne({ email });
    if (verifiedEmail && verifiedEmail.emailToken) {
      const url = `<a style='text-decoration:none;'
    href= http://${FrontEndKeys.url}:${FrontEndKeys.port}/${FrontEndKeys.endpoints[1]}/${verifiedEmail.emailToken}>Click Here to confirm your email</a>`;
      await this.emailSenderService.sendEmailMessage({
        from: '"Company" <' + NodeMailerOptions.transport.auth.username + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: `<h1>Hi User</h1> <br><br> <h2>Thanks for your registration</h2>
                <h3>Please Verify Your Email by clicking the following link</h3><br><br>
        ${url}`,
      });
    } else {
      throw new ConflictException('REGISTER.USER_NOT_REGISTERED');
    }
  }

  async verifyEmail(token: string): Promise<{ isFullyVerified: boolean, user: User }> {
    const verifiedEmail = await this.emailVerificationRepo.findOne({ emailToken: token });
    if (verifiedEmail && verifiedEmail.email) {
      const user = await this.userRepository.findOne({ email: verifiedEmail.email });
      if (user) {
        user.emailVerified = true;
        const updatedUser = await user.save();
        await verifiedEmail.remove();
        return { isFullyVerified: true, user: updatedUser };
      }
    } else {
      throw new ConflictException('LOGIN_EMAIL_CODE_NOT_VALID');
    }
  }


  isValidEmail(email: string) {
    if (email) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    } else
      return false;
  }


  async sendEmailForgottenPassword(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('LOGIN_USER_NOT_FOUND');
    }
    const tokenModel = await this.createForgottenPasswordToken(email);
    if (tokenModel && tokenModel.newPasswordToken) {
      const url = `<a style='text-decoration:none;'
    href= http://${FrontEndKeys.url}:${FrontEndKeys.port}/${FrontEndKeys.endpoints[0]}/${tokenModel.newPasswordToken}>Click here to reset your password</a>`;
      await this.emailSenderService.sendEmailMessage({
        from: '"Company" <' + NodeMailerOptions.transport.auth.username + '>',
        to: email,
        subject: 'Reset Your Password',
        text: 'Reset Your Password',
        html: `<h1>Hi User</h1> <br><br> <h2>You have requested to reset your password , please click the following link to change your password</h2>
             <h3>Please click the following link</h3><br><br>
        ${url}`,
      });
    }
  }

  async createForgottenPasswordToken(email: string) {
    let forgottenPassword = await this.forgottenPasswordRepo.findOne({ email });
    if (forgottenPassword && ((new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000) < 15) {
      throw new ConflictException('RESET_PASSWORD_EMAIL_SENT_RECENTLY');
    } else {
      forgottenPassword = new ForgottenPassword();
      forgottenPassword.email = email;
      forgottenPassword.timestamp = new Date();
      forgottenPassword.newPasswordToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
      return await forgottenPassword.save();
    }
  }

  async checkPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('User Does not Found');
    }
    return bcrypt.compare(password, user.password);
  }

  async setNewPassword(resetPasswordDto: ResetPasswordDto) {
    let isNewPasswordChanged = false;
    const { email, newPasswordToken, currentPassword, newPassword } = resetPasswordDto;
    if (email && currentPassword) {
      const isValidPassword = await this.checkPassword(email, currentPassword);
      if (isValidPassword) {
        isNewPasswordChanged = await this.setPassword(email, newPassword);
      } else {
        throw new ConflictException('RESET_PASSWORD_WRONG_CURRENT_PASSWORD');
      }
    } else if (newPasswordToken) {
      const forgottenPassword = await this.forgottenPasswordRepo.findOne({ newPasswordToken });
      isNewPasswordChanged = await this.setPassword(forgottenPassword.email, newPassword);
      if (isNewPasswordChanged) {
        await this.forgottenPasswordRepo.delete(forgottenPassword.id);
      }
    } else {
      return new ConflictException('RESET_PASSWORD_CHANGE_PASSWORD_ERROR');
    }
    return isNewPasswordChanged;
  }

  async setPassword(email: string, newPassword: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('LOGIN USER NOT FOUND');
    }
    user.password = await this.userRepository.hashPassword(newPassword, user.salt);
    await user.save();
    return true;
  }

  async signInAdmin(emailLoginDto: EmailLoginDto): Promise<{ token: string, admin: User }> {
    if (!(await this.isValidEmail(emailLoginDto.email))) {
      throw new BadRequestException('Invalid Email Signature');
    }
    const { email, admin } = await this.userRepository.validateAdminPassword(emailLoginDto);
    const payload: JwtPayload = { email };
    const token = this.jwtService.sign(payload);
    return { token, admin };
  }

  async getSystemUsers(): Promise<User[]> {
    return await this.userRepository.getSystemUsers();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      NotFound('User', id);
    }
    return user;
  }

  async editUserRoles(id: number, editRolesDto: EditRolesDto): Promise<{ processCompleted: boolean }> {
    const { roles } = editRolesDto;
    const user = await this.getUserById(id);
    user.claims = roles;
    await user.save();
    return { processCompleted: true };
  }

  async deleteUserAccount(user: User) {
    const profile = await this.profileService.getProfileData(user);
    // const subscriber = await this.notificationService.getSubscriberById(user.subscriberId);

    // procedure-2: delete-user
    await this.userRepository.delete(user.id);

    // procedure-3: delete-user-profile
    await this.profileService.deleteProfile(profile.id);

    // procedure-4: delete user subscriber
    // await this.notificationService.deleteSubscriber(subscriber.id);


    return true;

  }

  async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user').select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    return count >= 1;
  }


}
