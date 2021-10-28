import { Injectable } from '@nestjs/common';
import { Credentials, S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import awsConfig from './config';
import { FileUploadDTO } from './dto/file-upload-dto';

@Injectable()
export class AppService {
  private access: Credentials;
  private s3: S3;
  constructor() {
    this.access = new Credentials({
      ...awsConfig,
    });
    this.s3 = new S3({
      credentials: this.access,
      region: awsConfig.region,
    });
  }

  async createPresignedUrl(fileUploadDTO: FileUploadDTO): Promise<any> {
    const res = await this.s3.createPresignedPost({
      Bucket: awsConfig.Bucket,
      Fields: {
        Key: uuidv4(),
      },
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['content-length-range', 0, 1000000],
      ],
      Expires: 3600,
    });

    const s3Res = this.s3.getSignedUrl('getObject', {
      Bucket: awsConfig.Bucket,
      Key: res.fields.Key,
    });

    return { ...res, uploadedFileUrl: s3Res };
  }
}
