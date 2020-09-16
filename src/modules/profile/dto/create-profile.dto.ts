import { Gender } from '../../../commons/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '../../../commons/classes/contact';

export class CreateProfileDto {

  @ApiProperty({
    type: String,
    name: 'displayName',
    description: 'This is the name that will be displayed in your profile, it preferred to be the first name and the ' +
      ' last name',
    required: true,
    title: 'Display Name',
  })
  displayName: string;


  @ApiProperty({
    enum: [Gender.FEMALE, Gender.MALE],
    enumName: 'gender',
    name: 'gender',
    description: 'This is the gender of user, it only can have a value of MALE or FEMALE',
    required: true,
    title: 'Gender',
  })
  gender: Gender;

  @ApiProperty({
    type: [Contact],
    isArray: true,
    name: 'contacts',
    description: `This is your contacts, you must specify at least one contact that contain a phone number followed
       by address.
      Example:  
      {
          phone: +96279720123,
          address: City Center 4th circle      
      },`,
    required: true,
    title: 'Contacts',
  })
  contacts: Contact[];

  @ApiProperty({
    type: String,
    name: 'country',
    description: 'This is the country that you are from it',
    required: true,
    title: 'Country',
  })
  country: string;

  @ApiProperty({
    type: String,
    name: 'city',
    description: 'This is the city, inside the country that you are from it ',
    required: true,
    title: 'City',
  })
  city: string;

}
