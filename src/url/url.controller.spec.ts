import { randomUUID } from 'crypto';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { UrlController as UrlController } from './url.controller';
import { UrlService } from './url.service';

const baseUrl = 'https://www.example.com';
const createUrl = () => `${baseUrl}/${randomUUID()}`;
const testUrl = new Url(createUrl());
const testUrlArray = Array(5)
  .fill(1)
  .map(() => new Url(createUrl()));
const createdId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

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
            incrementTimesVisited: jest.fn().mockImplementation(() => {}),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
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

  it('should redirect and increment times visited', async () => {
    const res = createResponse();
    const statusSpy = jest.spyOn(res, 'status');

    const created = await controller.create({ target: testUrl.target });

    await controller.visit(created.id, res);
    expect(service.incrementTimesVisited).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(HttpStatus.MOVED_PERMANENTLY);
    expect(res.statusCode).toBe(HttpStatus.FOUND);
    expect(res._getRedirectUrl()).toEqual(created.target);
  });
});
