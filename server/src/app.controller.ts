import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FileUploadDTO } from './dto/file-upload-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createPresignedUrl(@Body() fileUploadDTO: FileUploadDTO): Promise<any> {
    return this.appService.createPresignedUrl(fileUploadDTO);
  }
}
