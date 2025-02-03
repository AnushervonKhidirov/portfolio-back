import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AcquiredSkillsService } from './acquired-skills.service';
import { CreateAcquiredSkillDto } from './dto/create-acquired-skill.dto';
import { UpdateAcquiredSkillDto } from './dto/update-acquired-skill.dto';
import { AcquiredSkillEntity } from './entity/acquired-skills.entity';

@Controller('acquired-skills')
export class AcquiredSkillsController {
  constructor(private readonly acquiredSkills: AcquiredSkillsService) {}

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    isArray: true,
    example: [
      {
        id: '9046a660-fdd1-4756-8f8f-4c2daa8cb446',
        progress: 80,
        skill: {
          id: '3e0603be-5916-4073-a571-02522d7609ab',
          name: 'NestJS',
          createdAt: '2025-01-31T07:49:21.396Z',
        },
        createdAt: '2025-02-03T05:00:23.326Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.acquiredSkills.findAll();
  }

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    example: {
      id: '9046a660-fdd1-4756-8f8f-4c2daa8cb446',
      progress: 80,
      skill: {
        id: '3e0603be-5916-4073-a571-02522d7609ab',
        name: 'NestJS',
        createdAt: '2025-01-31T07:49:21.396Z',
      },
      createdAt: '2025-02-03T05:00:23.326Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const acquiredSkills = await this.acquiredSkills.findOne(id);

    if (!acquiredSkills) throw new NotFoundException('Learned skill not found');
    return acquiredSkills;
  }

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    example: {
      id: '9046a660-fdd1-4756-8f8f-4c2daa8cb446',
      progress: 80,
      skill: {
        id: '3e0603be-5916-4073-a571-02522d7609ab',
        name: 'NestJS',
        createdAt: '2025-01-31T07:49:21.396Z',
      },
      createdAt: '2025-02-03T05:00:23.326Z',
    },
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createAcquiredSkillDto: CreateAcquiredSkillDto,
  ) {
    const createdLearnedSkill = await this.acquiredSkills.create(
      createAcquiredSkillDto,
    );

    if (!createdLearnedSkill) {
      throw new ConflictException(`Skill already exist`);
    }

    return createdLearnedSkill;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateAcquiredSkillDto: UpdateAcquiredSkillDto,
  ) {
    const result = await this.acquiredSkills.update(id, updateAcquiredSkillDto);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.acquiredSkills.delete(id);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }
}
