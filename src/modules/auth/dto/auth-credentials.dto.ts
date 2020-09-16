import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    type: String,
    name: 'username',
    description: 'This is your username, you must add a unique one, we will notify you when you insert a value that' +
      ' exist in the database, type it carefully!',
    required: true,
    title: 'Username',
  })
  username: string;

  @ApiProperty({
    type: String,
    name: 'email',
    description: 'You must add your email, provide a valid one that can send and receive emails',
    required: true,
    title: 'Email',
  })
  email: string;

  @ApiProperty({
    type: String,
    name: 'password',
    description: 'You must insert a strong password, that mixed with letters and symbols to avoid security issues',
    required: true,
    title: 'Password',
  })
  password: string;
}
