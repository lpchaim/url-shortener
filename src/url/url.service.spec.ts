import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { UrlService } from './url.service';

const testUrl = new Url('short');
const testUrlArray = [new Url('short1'), new Url('short2'), new Url('short3')];

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            create: jest.fn().mockReturnValue(testUrl),
            find: jest.fn().mockResolvedValue(testUrlArray),
            findOne: jest.fn().mockResolvedValue(testUrl),
            save: jest.fn().mockImplementation((url: Url) => url),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    const testUrlArgs = {
      target: testUrl.target,
    } as CreateUrlDto;

    const createdUrl = await service.create(testUrlArgs);

    expect(createdUrl).toEqual(testUrl);
    expect(repository.create).toBeCalledTimes(1);
    expect(repository.create).toBeCalledWith(testUrlArgs);
    expect(repository.save).toBeCalledTimes(1);
    expect(repository.save).toBeCalledWith(createdUrl);
  });

  it('should find all', async () => {
    const urls = await service.findAll();
    expect(repository.find).toBeCalledTimes(1);
    expect(urls).toEqual(testUrlArray);
  });

  it('should find one', async () => {
    const url = await service.findOne(testUrl.id);
    expect(repository.findOne).toBeCalledTimes(1);
    expect(url).toEqual(testUrl);
  });
});
