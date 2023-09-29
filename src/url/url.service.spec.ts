import { randomUUID } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { UrlService } from './url.service';

const baseUrl = 'https://www.example.com';
const createUrl = () => `${baseUrl}/${randomUUID()}`;

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;
  let repoObjects: Url[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUrlDto) => {
              const url = new Url(dto.target);
              url.id = randomUUID();
              return url;
            }),
            findOne: jest
              .fn()
              .mockImplementation(
                async ({ where: { id } }) =>
                  repoObjects.find((item) => item.id == id) ?? null,
              ),
            find: jest.fn().mockImplementation(async () => [...repoObjects]),
            save: jest.fn().mockImplementation(async (url: Url) => {
              if (repoObjects.find((item) => item.id == url.id)) {
                throw new Error('Duplicate id');
              }
              repoObjects.push(url);
              return url;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
    repoObjects = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    const testUrlArgs = {
      target: baseUrl,
    } as CreateUrlDto;

    const createdUrl = await service.create(testUrlArgs);

    expect(createdUrl.target).toEqual(baseUrl);
    expect(repository.create).toBeCalledTimes(1);
    expect(repository.create).toBeCalledWith(testUrlArgs);
    expect(repository.save).toBeCalledTimes(1);
    expect(repository.save).toBeCalledWith(createdUrl);
  });

  it('should handle id colisions', async () => {
    // Generates two records with the same id one after the other, then resumes normal behavior
    const generateIdSpy = jest
      .spyOn(service as any, 'generateId')
      .mockImplementationOnce(() => 'fixed')
      .mockImplementationOnce(() => 'fixed');

    const sameInitialId1: Url = await service.create({ target: createUrl() });
    expect(generateIdSpy).toHaveNthReturnedWith(1, 'fixed');

    const sameInitialId2: Url = await service.create({ target: createUrl() });
    expect(generateIdSpy).toHaveNthReturnedWith(2, 'fixed');
    expect(generateIdSpy).not.toHaveNthReturnedWith(3, 'fixed');

    expect(generateIdSpy).toHaveBeenCalledTimes(3);
    expect(sameInitialId1.id).not.toEqual(sameInitialId2.id);

    generateIdSpy.mockRestore();
  });

  it('should create and find one', async () => {
    const findOneSpy = jest.spyOn(service, 'findOne');

    const created = await service.create({ target: baseUrl });

    const url = await service.findOne(created.id);
    expect(findOneSpy).toHaveBeenCalled();
    expect(url?.target).toEqual(baseUrl);
  });

  it('should create and find all', async () => {
    const testUrlArray = await Promise.all(
      Array(5)
        .fill(1)
        .map(() => createUrl()),
    );
    await Promise.all(
      testUrlArray.map((url) => service.create({ target: url })),
    );

    const urls = await service.findAll();
    expect(repository.find).toBeCalledTimes(1);
    urls.forEach((url, index) => {
      expect(url.target).toEqual(testUrlArray[index]);
    });
  });
});
