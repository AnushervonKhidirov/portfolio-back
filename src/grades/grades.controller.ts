import { Controller, Get, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  async getGrades() {
    return await this.gradesService.getGrades();
  }

  @Get(':id')
  async getGrade(@Param('id') id: string) {
    return await this.gradesService.getGrade(id);
  }
}
