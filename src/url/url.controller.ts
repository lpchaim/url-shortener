import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateUrlDto } from './dto/create-url.dto';
import { UrlService } from './url.service';

@Controller({
  path: 'url',
  version: '1',
})
@ApiTags('url')
export class UrlController {
  constructor(private readonly urlsService: UrlService) {}

  @Post()
  @ApiOperation({
    summary: 'Create short URL',
  })
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all short URLs',
  })
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get short URL',
  })
  async findOne(@Param('id') id: string) {
    const url = await this.urlsService.findOne(id);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }

  @Get(':id/visit')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @ApiOperation({
    summary: 'Visit URL',
  })
  async visit(@Param('id') id: string, @Res() req: Response) {
    const url = await this.urlsService.findOne(id);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    this.urlsService.incrementTimesVisited(url);
    req.status(HttpStatus.MOVED_PERMANENTLY).redirect(url.target);
  }
}
