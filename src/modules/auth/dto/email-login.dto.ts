import { ApiProperty } from '@nestjs/swagger';

export class EmailLoginDto {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'This is the email of your account in our system',
    required: true,
    title: 'Email',
  })
  email: string;

  @ApiProperty({
    type: String,
    name: 'password',
    description: 'This is the password the you have entered when you create your account, ' +
      'please make sure to enter the correct one',
    required: true,
    title: 'Password',
  })
  password: string;
}
