import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { Candidate } from './candidate.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CandidateController', () => {
  let controller: CandidateController;
  let service: CandidateService;

  const mockCandidate: Candidate = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    seniority: 'senior' as any, // Type assertion to avoid type error in test
    yearsOfExperience: 5,
    availability: true,
    createdAt: new Date(),
  };

  const mockFile = {
    buffer: Buffer.from('test'),
    originalname: 'test.xlsx',
    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
      providers: [
        CandidateService,
        {
          provide: getRepositoryToken(Candidate),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
    service = module.get<CandidateService>(CandidateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of candidates', async () => {
      const result = [mockCandidate];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    it('should process and upload file', async () => {
      const name = 'John';
      const surname = 'Doe';
      
      jest.spyOn(service, 'processExcel').mockResolvedValue(mockCandidate);

      const result = await controller.uploadFile(mockFile, name, surname);

      expect(service.processExcel).toHaveBeenCalledWith(mockFile, name, surname);
      expect(result).toEqual(mockCandidate);
    });

    it('should throw error for invalid file type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'text/plain',
      } as Express.Multer.File;

      await expect(
        controller.uploadFile(invalidFile, 'John', 'Doe')
      ).rejects.toThrow();
    });
  });
});
