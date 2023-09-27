import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { CreateUrlDto } from './dto/create-url.dto';
import { UrlService } from './url.service';

@Controller({
  path: 'url',
})
export class UrlController {
  constructor(private readonly urlsService: UrlService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const url = await this.urlsService.findOne(id);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }
}
