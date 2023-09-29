import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
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
    let url = this.urlRepository.create(createUrlDto);

    let id: string;
    do {
      id = this.generateId();
    } while (await this.findOne(id));
    url.id = id;

    url = await this.urlRepository.save(url);
    return url;
  }

  async findAll() {
    return this.urlRepository.find();
  }

  async findOne(id: string) {
    return this.urlRepository.findOne({ where: { id } });
  }

  private generateId(): string {
    return nanoid(8);
  }

  async incrementTimesVisited(url: Url) {
    url.timesVisited += 1;
    await this.urlRepository.save(url);
    return url;
  }
}
