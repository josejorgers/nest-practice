import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { CandidateService } from './candidate.service';
import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@ApiTags('candidates')
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  async findAll(): Promise<Candidate[]> {
    return this.candidateService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        surname: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'surname', 'file'],
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 10 }), // 10KB
          new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body('name') name: string,
    @Body('surname') surname: string,
  ): Promise<Candidate> {
    if (!name || !surname) {
      throw new Error('Name and surname are required');
    }
    return this.candidateService.processExcel(file, name, surname);
  }
}
