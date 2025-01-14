import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiExcludeEndpoint()
  @Get('/hello')

  getHello(): string {
    return this.appService.getHello();
  }
}