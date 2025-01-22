import { Controller, Get, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  async findAll() {
    return await this.gradesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gradesService.findOne(id);
  }
}
