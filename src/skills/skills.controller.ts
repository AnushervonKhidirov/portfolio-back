import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ValidationPipe,
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SkillsService } from './skills.service';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillService: SkillsService) {}

  @Get()
  async findAll() {
    return await this.skillService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const skill = await this.skillService.findOne(id);
    if (!skill) throw new NotFoundException();
    return skill;
  }

  @Post()
  async create(@Body(new ValidationPipe()) createSkillDto: CreateSkillDto) {
    const skill = await this.skillService.create(createSkillDto);

    if (!skill) {
      throw new ConflictException(
        `Skill '${createSkillDto.name}' already exist`,
      );
    }

    return skill;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateSkillDto: UpdateSkillDto,
  ) {
    const result = await this.skillService.update(id, updateSkillDto);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.skillService.delete(id);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }
}
