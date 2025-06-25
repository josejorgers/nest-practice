import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidateRepository.create(createCandidateDto);
    return this.candidateRepository.save(candidate);
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async processExcel(file: Express.Multer.File, name: string, surname: string): Promise<Candidate> {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }

    const excelData = data[0] as any;
    
    const createCandidateDto: CreateCandidateDto = {
      name,
      surname,
      seniority: excelData.seniority,
      yearsOfExperience: excelData['years of experience'],
      availability: excelData.availability === 'TRUE' || excelData.availability === true,
    };

    return this.create(createCandidateDto);
  }
}
