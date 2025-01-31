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
import { AcquiredSkillsService } from './acquired-skills.service';
import { CreateAcquiredSkillDto } from './dto/create-acquired-skill.dto';
import { UpdateAcquiredSkillDto } from './dto/update-acquired-skill.dto';

@Controller('acquired-skills')
export class AcquiredSkillsController {
  constructor(private readonly acquiredSkills: AcquiredSkillsService) {}

  @Get()
  async findAll() {
    return await this.acquiredSkills.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const acquiredSkills = await this.acquiredSkills.findOne(id);

    if (!acquiredSkills) throw new NotFoundException('Learned skill not found');
    return acquiredSkills;
  }

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
