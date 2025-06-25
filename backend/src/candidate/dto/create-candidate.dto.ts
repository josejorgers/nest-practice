import { IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { SeniorityLevel } from '../candidate.entity';

export class CreateCandidateDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEnum(SeniorityLevel)
  seniority: SeniorityLevel;

  @IsNumber()
  yearsOfExperience: number;

  @IsBoolean()
  availability: boolean;
}
