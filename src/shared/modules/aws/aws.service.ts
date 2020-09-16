import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { Config } from '../../../config';
import AwsConfig = Config.AwsConfig;
import { UploadOptions } from '../../../commons/interfaces/upload-options.interface';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: AwsConfig.ACCESS_KEY_ID,
  secretAccessKey: AwsConfig.SECRET_ACCESS_KEY,
  region: AwsConfig.region,
});
s3.config.update({
  accessKeyId: AwsConfig.ACCESS_KEY_ID,
  secretAccessKey: AwsConfig.SECRET_ACCESS_KEY,
  region: AwsConfig.region,
});

@Injectable()
export class AwsService {

  async uploadImage() {

  }

  async uploadProfileImage(file: any, options: UploadOptions) {

  }

  async uploadProductImage() {

  }

  async fileUpload(file: any, options: UploadOptions): Promise<string> {
    const { folderName, subFolder, type } = options;
    return new Promise((resolve, reject) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: AwsConfig.AWS_S3_BUCKET_NAME,
        Key: type ? `${folderName}/${subFolder}/${type}/${name}-${randomName}${fileExtName}` : `${folderName}/${subFolder}/${name}-${randomName}${fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read',
      };
      s3.upload(params, (err, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          return reject(err);
        }
        resolve(`${AwsConfig.cdnUrl}/${data.Key}`);
      });
    });
  }


  async fileDelete(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: AwsConfig.AWS_S3_BUCKET_NAME,
        Key: filename.substring(55),
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}
