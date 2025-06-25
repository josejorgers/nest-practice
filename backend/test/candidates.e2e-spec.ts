import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './../src/candidate/candidate.entity';
import { Repository } from 'typeorm';

describe('CandidatesController (e2e)', () => {
  let app: INestApplication;
  let candidateRepository: Repository<Candidate>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Candidate],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    candidateRepository = moduleFixture.get('CandidateRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await candidateRepository.clear();
  });

  describe('/candidates (GET)', () => {
    it('should return an empty array when no candidates exist', () => {
      return request(app.getHttpServer())
        .get('/candidates')
        .expect(200)
        .expect([]);
    });

    it('should return all candidates', async () => {
      const candidate = candidateRepository.create({
        name: 'John',
        surname: 'Doe',
        seniority: 'senior',
        yearsOfExperience: 5,
        availability: true,
      });
      await candidateRepository.save(candidate);

      const response = await request(app.getHttpServer())
        .get('/candidates')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('John');
      expect(response.body[0].surname).toBe('Doe');
    });
  });

  describe('/candidates/upload (POST)', () => {
    it('should upload and process a candidate with Excel file', async () => {
      const mockFile = Buffer.from('Seniority,Years of experience,Availability\nsenior,5,true');
      
      const response = await request(app.getHttpServer())
        .post('/candidates/upload')
        .field('name', 'John')
        .field('surname', 'Doe')
        .attach('file', mockFile, 'test.xlsx')
        .expect(201);

      expect(response.body.name).toBe('John');
      expect(response.body.surname).toBe('Doe');
      expect(response.body.seniority).toBe('senior');
      expect(response.body.yearsOfExperience).toBe(5);
      expect(response.body.availability).toBe(true);
    });

    it('should fail when required fields are missing', async () => {
      const mockFile = Buffer.from('test');
      
      await request(app.getHttpServer())
        .post('/candidates/upload')
        .attach('file', mockFile, 'test.xlsx')
        .expect(400);
    });
  });
});
