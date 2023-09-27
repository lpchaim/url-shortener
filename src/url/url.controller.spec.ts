import { Test, TestingModule } from '@nestjs/testing';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { UrlController as UrlController } from './url.controller';
import { UrlService } from './url.service';

const testUrl = new Url('short');
const testUrlArray = [new Url('short1'), new Url('short2'), new Url('short3')];
const createdId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

describe('UrlController', () => {
  let controller: UrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((dto: CreateUrlDto) =>
                Promise.resolve({ ...dto, id: createdId }),
              ),
            findAll: jest.fn().mockResolvedValue(testUrlArray),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                target: testUrl.target,
                id,
              }),
            ),
            findOneByShort: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                target: testUrl.target,
                id,
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', async () => {
    const createUrlDto: CreateUrlDto = {
      target: testUrl.target,
    };
    await expect(controller.create(createUrlDto)).resolves.toEqual({
      target: testUrl.target,
      id: createdId,
    });
  });

  it('should find all', async () => {
    await expect(controller.findAll()).resolves.toEqual(testUrlArray);
  });

  it('should find one', async () => {
    const found = await controller.findOne(createdId as any);
    expect(found).not.toBeNull();
    expect(found?.id).toEqual(createdId);
  });
});
