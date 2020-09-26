import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {

  @ApiProperty({
    type: String,
    name: 'newPassword',
    description: 'This is the new password that you have entered it!',
    required: true,
    title: 'New Password',
  })
  readonly newPassword: string;
  @ApiProperty({
    type: String,
    name: 'newPasswordToken',
    description: 'This is the password token that determine if you authorized to do this process or not',
    required: true,
    title: 'New Password Token',
  })
  readonly newPasswordToken: string;
  @ApiProperty({
    type: String,
    name: 'confirmPassword',
    description: 'This is not required filed, is just to make sure that your new password and this conformation  ' +
      'password are match',
    required: false,
    title: 'Confirm Password',
  })
  readonly confirmPassword: string;
}
