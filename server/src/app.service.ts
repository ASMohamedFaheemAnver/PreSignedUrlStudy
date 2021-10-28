import { Injectable } from '@nestjs/common';
import { Credentials, S3 } from 'aws-sdk';
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
    });
  }

  async createPresignedUrl(fileUploadDTO: FileUploadDTO): Promise<any> {
    const res = await this.s3.createPresignedPost({
      Bucket: awsConfig.Bucket,
      Fields: {
        Key: `${fileUploadDTO.filePath}`,
      },
      // Expires: 100,
    });
    return res;
  }
}
