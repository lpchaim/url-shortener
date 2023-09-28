import { randomUUID, randomInt } from 'crypto';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

let targets: string[];

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    targets = Array(5)
      .fill(1)
      .map(() => `https://www.example.com/${randomUUID()}`);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('creates many, finds one, finds all at /url', async () => {
    const ids: string[] = [];

    for (const [index, target] of Object.entries(targets)) {
      const response = await request(app.getHttpServer()).post('/url').send({
        target,
      });
      expectObjectHasMatchingTarget(response.body, targets[Number(index)]);
      ids.push(response.body.id);
    }

    const index = randomInt(0, targets.length - 1);
    const singleId = ids[index];
    const singleResponse = await request(app.getHttpServer())
      .get(`/url/${singleId}`)
      .expect(HttpStatus.OK);
    expect(singleResponse.body.id).toBe(singleId);
    expectObjectHasMatchingTarget(singleResponse.body, targets[Number(index)]);

    const allResponse = await request(app.getHttpServer())
      .get('/url')
      .expect(HttpStatus.OK);
    expect(allResponse.body).toHaveLength(targets.length);
    (allResponse.body as any[]).forEach((body, index) =>
      expectObjectHasMatchingTarget(body, targets[index]),
    );
  });
});

function expectObjectHasMatchingTarget(
  body: Record<string, any>,
  target: string,
) {
  expect(body).toMatchObject({
    id: expect.any(String),
    target,
    timesVisited: 0,
    createdDate: expect.any(String),
    updatedDate: expect.any(String),
  });
}
