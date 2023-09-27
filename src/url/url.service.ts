import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async create(createUrlDto: CreateUrlDto) {
    const url = this.urlRepository.create(createUrlDto);
    await this.urlRepository.save(url);
    return url;
  }

  async findAll() {
    return this.urlRepository.find();
  }

  async findOne(id: string) {
    return this.urlRepository.findOne({ where: { id } });
  }
}
