import { IsString, MinLength } from 'class-validator';

export class FileUploadDTO {
  @IsString()
  @MinLength(3)
  fileType: string;
}
