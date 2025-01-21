import { Controller, Get, Param, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { TSkillQuery } from './skills.type';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillService: SkillsService) {}

  @Get()
  async getSkills(@Query() query: TSkillQuery) {
    return await this.skillService.getSkills(query);
  }

  @Get(':id')
  async getSkillById(@Param('id') id: string) {
    return await this.skillService.getSkill(id);
  }
}
