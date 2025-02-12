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
import { ApiOkResponse } from '@nestjs/swagger';

import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entity/skill.entity';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillService: SkillsService) {}

  @ApiOkResponse({
    type: SkillEntity,
    isArray: true,
    example: [
      {
        id: '3e0603be-5916-4073-a571-02522d7609ab',
        name: 'NestJS',
        createdAt: '2025-01-31T07:49:21.396Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.skillService.findAll();
  }

  @ApiOkResponse({
    type: SkillEntity,
    example: {
      id: '3e0603be-5916-4073-a571-02522d7609ab',
      name: 'NestJS',
      createdAt: '2025-01-31T07:49:21.396Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const skill = await this.skillService.findOne(id);
    if (!skill) throw new NotFoundException();
    return skill;
  }

  @ApiOkResponse({
    type: SkillEntity,
    example: {
      id: '3e0603be-5916-4073-a571-02522d7609ab',
      name: 'NestJS',
      createdAt: '2025-01-31T07:49:21.396Z',
    },
  })
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
    const skill = await this.skillService.update(id, updateSkillDto);
    if (!skill) throw new NotFoundException(`Skill doesn't exist`);
    return skill;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.skillService.delete(id);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }
}
