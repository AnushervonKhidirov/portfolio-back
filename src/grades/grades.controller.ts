import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeEntity } from './entity/grade.entity';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @ApiOkResponse({
    type: GradeEntity,
    isArray: true,
    example: [
      {
        id: 'be2131c3-4807-4838-83f7-9e28fe32252c',
        name: 'Middle',
        createdAt: '2025-01-31T15:00:53.972Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.gradesService.findAll();
  }

  @ApiOkResponse({
    type: GradeEntity,
    isArray: true,
    example: {
      id: 'be2131c3-4807-4838-83f7-9e28fe32252c',
      name: 'Middle',
      createdAt: '2025-01-31T15:00:53.972Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const grade = await this.gradesService.findOne(id);
    if (!grade) throw new NotFoundException();
    return grade;
  }

  @ApiOkResponse({
    type: GradeEntity,
    isArray: true,
    example: {
      id: 'be2131c3-4807-4838-83f7-9e28fe32252c',
      name: 'Middle',
      createdAt: '2025-01-31T15:00:53.972Z',
    },
  })
  @Post()
  async create(@Body(new ValidationPipe()) createGradeDto: CreateGradeDto) {
    const grade = await this.gradesService.create(createGradeDto);
    if (!grade) {
      throw new ConflictException(
        `Position '${createGradeDto.name}' already exist`,
      );
    }

    return grade;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateGradeDto: UpdateGradeDto,
  ) {
    const grade = await this.gradesService.update(id, updateGradeDto);
    if (!grade) throw new NotFoundException();
    return grade;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.gradesService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
