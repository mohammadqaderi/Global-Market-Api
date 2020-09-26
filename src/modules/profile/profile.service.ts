import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AwsService } from '../../shared/modules/aws/aws.service';


@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>,
              private awsService: AwsService) {
  }

  async getTotalProfiles() {
    return await this.profileRepository.createQueryBuilder().getCount();
  }

  async getProfileData(user: User): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profileId,
      },
    });
    if (!profile) {
      throw new NotFoundException('profile does not found');
    }
    return profile;
  }

  async deleteProfile(id: number): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('profile does not found');
    }
  }

  async createUserProfile(user: User, createProfileDto: CreateProfileDto) {
    const profile = new Profile();
    const { displayName, contacts, city, country, gender } = createProfileDto;
    profile.user = user;
    profile.displayName = displayName;
    profile.contacts = contacts;
    profile.city = city;
    profile.gender = gender;
    profile.country = country;
    const userProfile = await profile.save();
    return userProfile;
  }

  async editProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = await this.getProfileData(user);
    const { country, gender, city, contacts, displayName }
      = createProfileDto;

    if (displayName) {
      profile.displayName = displayName;
    }

    if (city) {
      profile.city = city;
    }

    if (contacts) {
      profile.contacts = contacts;
    }

    if (country) {
      profile.country = country;
    }
    if (gender) {
      profile.gender = gender;
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async setProfileImage(user: User, folderName: string, subFolder: string, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      profile.image = await this.awsService.fileUpload(image, { folderName: folderName, subFolder: subFolder, type: null });
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async changeProfileImage(user: User, folderName: string, subFolder: string, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      await this.awsService.fileDelete(profile.image);
      profile.image = await this.awsService.fileUpload(image, { folderName: folderName, subFolder: subFolder, type: null });
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async deleteProfileImage(user: User): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (!profile.image) {
      throw new ConflictException('the profile has no image to delete!');
    }
    await this.awsService.fileDelete(profile.image);
    profile.image = null;
    const savedProfile = await profile.save();
    return savedProfile;
  }
}
