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
  ConflictException,
  NotFoundException,
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
    return await this.skillService.findAll();
  }

  @ApiOkResponse({ type: SkillEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const skill = await this.skillService.findOne({ id });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body(new ValidationPipe()) createSkillDto: CreateSkillDto) {
    const skill = await this.skillService.create(createSkillDto);
    if (!skill) throw new ConflictException('Skill already exist');
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateSkillDto: UpdateSkillDto,
  ) {
    const existedSkill = await this.skillService.findOne({
      value: updateSkillDto.value,
    });

    if (existedSkill) {
      throw new ConflictException(
        `Skill '${updateSkillDto.value}' already exist with id ${existedSkill.id}`,
      );
    }

    const skill = await this.skillService.update(id, updateSkillDto);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  @ApiOkResponse({ type: SkillEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const skill = await this.skillService.delete(id);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }
}
