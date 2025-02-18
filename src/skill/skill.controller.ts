import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { SkillEntity } from './entity/skill.entity';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiOkResponse({ type: SkillEntity, isArray: true })
  @Get()
  async findAll() {
    const [skills, err] = await this.skillService.findAll();
    if (err) throw err;
    return skills;
  }

  @ApiOkResponse({ type: SkillEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [skill, err] = await this.skillService.findOne({ id });
    if (err) throw err;
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body(new ValidationPipe()) createSkillDto: CreateSkillDto) {
    const [skill, err] = await this.skillService.create(createSkillDto);
    if (err) throw err;
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateSkillDto: UpdateSkillDto,
  ) {
    const [skill, err] = await this.skillService.update(id, updateSkillDto);
    if (err) throw err;
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [skill, err] = await this.skillService.delete(id);
    if (err) throw err;
    return skill;
  }
}
