import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateService } from './candidate.service';
import { Candidate, SeniorityLevel } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';

const mockFile = {
  buffer: Buffer.from('test'),
  originalname: 'test.xlsx',
  mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as Express.Multer.File;

describe('CandidateService', () => {
  let service: CandidateService;
  let repository: Repository<Candidate>;

  const mockCandidate: Candidate = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    seniority: SeniorityLevel.SENIOR,
    yearsOfExperience: 5,
    availability: true,
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    repository = module.get<Repository<Candidate>>(getRepositoryToken(Candidate));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a candidate', async () => {
      const createDto: CreateCandidateDto = {
        name: 'John',
        surname: 'Doe',
        seniority: SeniorityLevel.SENIOR,
        yearsOfExperience: 5,
        availability: true,
      };

      mockRepository.create.mockReturnValue(mockCandidate);
      mockRepository.save.mockResolvedValue(mockCandidate);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockCandidate);
      expect(result).toEqual(mockCandidate);
    });
  });

  describe('findAll', () => {
    it('should return an array of candidates', async () => {
      const candidates = [mockCandidate];
      mockRepository.find.mockResolvedValue(candidates);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(candidates);
    });
  });

  describe('processExcel', () => {
    let xlsxMock: any;

    beforeEach(() => {
      // Mock xlsx module
      xlsxMock = {
        read: jest.fn().mockReturnValue({
          SheetNames: ['Sheet1'],
          Sheets: {
            Sheet1: {}
          }
        }),
        utils: {
          sheet_to_json: jest.fn()
        }
      };
      
      // Mock the xlsx import
      jest.mock('xlsx', () => xlsxMock);
      
      // Clear the require cache to ensure we get a fresh instance with our mock
      jest.resetModules();
      const { CandidateService } = require('./candidate.service');
      service = new CandidateService(repository);
    });

    afterEach(() => {
      jest.unmock('xlsx');
    });

    it('should process excel file and create candidate', async () => {
      // Setup mock data
      const mockExcelData = [{
        seniority: 'senior',
        'years of experience': 5,
        availability: 'TRUE'
      }];
      
      xlsxMock.utils.sheet_to_json.mockReturnValue(mockExcelData);
      
      const mockExcelBuffer = Buffer.from('test');
      const mockExcelFile = { buffer: mockExcelBuffer } as Express.Multer.File;
      
      mockRepository.create.mockReturnValue(mockCandidate);
      mockRepository.save.mockResolvedValue(mockCandidate);

      const result = await service.processExcel(mockExcelFile, 'John', 'Doe');

      // Verify xlsx was called correctly
      expect(xlsxMock.read).toHaveBeenCalledWith(mockExcelBuffer, { type: 'buffer' });
      expect(xlsxMock.utils.sheet_to_json).toHaveBeenCalled();
      
      // Verify repository was called with correct data
      expect(repository.create).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        seniority: 'senior',
        yearsOfExperience: 5,
        availability: true,
      });
      expect(result).toEqual(mockCandidate);
    });
  });
});
