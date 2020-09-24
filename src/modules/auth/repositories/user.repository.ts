import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EmailLoginDto } from '../dto/email-login.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../../commons/enums/user-role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }

  async getSystemUsers() {
    const query = this.createQueryBuilder('user');
    const users = await query.select(['user.id', 'user.email', 'user.username', 'user.claims', 'user.emailVerified']).getMany();
    return users;
  }

  async validateUserPassword(emailLoginDto: EmailLoginDto): Promise<{ email: string, user: User }> {
    const { email, password } = emailLoginDto;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    if ((await user.validatePassword(password))) {
      return { email, user };
    } else {
      throw new BadRequestException('Your Password is incorrect, try another one!');
    }
  }

  async validateAdminPassword(emailLoginDto: EmailLoginDto) {
    const { email, password } = emailLoginDto;
    const admin = await this.findByEmail(email);
    if (!admin) {
      throw new NotFoundException('User does not exist in the database');
    }
    const isAdmin = (): boolean => admin.claims.some(role => role === UserRole.SUPER_ADMIN || UserRole.WEAK_ADMIN);
    if (!isAdmin()) {
      throw new ForbiddenException('This Resource Is Forbidden');
    }
    if (admin && (await admin.validatePassword(password))) {
      return { email, admin };
    } else {
      throw new BadRequestException('Your Password in incorrect, please enter another one');
    }
  }

  async hashPassword(password, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
