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
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  async findAll() {
    return await this.gradesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const grade = await this.gradesService.findOne(id);
    if (!grade) throw new NotFoundException();
    return grade;
  }

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
    const result = await this.gradesService.update(id, updateGradeDto);
    if (!result) throw new NotFoundException();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.gradesService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
