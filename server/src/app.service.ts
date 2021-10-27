import { Injectable } from '@nestjs/common';
import { Credentials, S3 } from 'aws-sdk';
import awsConfig from './config';

@Injectable()
export class AppService {
  private access: Credentials;
  private s3: S3;
  constructor() {
    this.access = new Credentials({
      ...awsConfig,
    });
    this.s3 = new S3({});
  }

  createPresignedUrl(): string {
    this.s3.getSignedUrl('putObject', {
      Bucket: 's3udevstudy',
      Key: '',
      Expires: 100,
    });
    return 'Ok!';
  }
}
