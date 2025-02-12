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

const example = {
  id: 'e7ecf04f-5ed3-4cc2-a233-495409c54e25',
  progress: 80,
  skillType: 'Programming languages',
  createdAt: '2025-02-03T16:44:40.810Z',
  skill: {
    id: 'f8ad5f19-15e4-4127-9534-44e84f9264c6',
    name: 'JavaScript',
    createdAt: '2025-02-03T05:35:39.495Z',
  },
};

@Controller('acquired-skills')
export class AcquiredSkillsController {
  constructor(private readonly acquiredSkills: AcquiredSkillsService) {}

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    isArray: true,
    example: [example],
  })
  @Get()
  async findAll() {
    return await this.acquiredSkills.findAll();
  }

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    example: example,
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const acquiredSkills = await this.acquiredSkills.findOne(id);

    if (!acquiredSkills) throw new NotFoundException('Learned skill not found');
    return acquiredSkills;
  }

  @ApiOkResponse({
    type: AcquiredSkillEntity,
    example: example,
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
    const acquiredSkill = await this.acquiredSkills.update(
      id,
      updateAcquiredSkillDto,
    );
    
    if (!acquiredSkill) throw new NotFoundException(`Skill doesn't exist`);
    return acquiredSkill;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.acquiredSkills.delete(id);
    if (!result) throw new NotFoundException(`Skill doesn't exist`);
  }
}
