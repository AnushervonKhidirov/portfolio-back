import {
  Controller,
  Get,
  Post,
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.skillService.delete(id);
    if (!result) throw new NotFoundException(`Skill with doesn't exist`);
  }
}
