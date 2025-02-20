import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiHeader } from '@nestjs/swagger';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeEntity } from './entity/grade.entity';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @ApiOkResponse({ type: GradeEntity, isArray: true })
  @Get()
  async findAll() {
    const [grades, err] = await this.gradeService.findAll();
    if (err) throw err;
    return grades;
  }

  @ApiOkResponse({ type: GradeEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [grade, err] = await this.gradeService.findOne({ id });
    if (err) throw err;
    return grade;
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: GradeEntity })
  @Post()
  async create(@Body(new ValidationPipe()) createGradeDto: CreateGradeDto) {
    const [grade, err] = await this.gradeService.create(createGradeDto);
    if (err) throw err;
    return grade;
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: GradeEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateGradeDto: UpdateGradeDto,
  ) {
    const [grade, err] = await this.gradeService.update(id, updateGradeDto);
    if (err) throw err;
    return grade;
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @ApiOkResponse({ type: GradeEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [grade, err] = await this.gradeService.delete(id);
    if (err) throw err;
    return grade;
  }
}
