import type { TSkill, TSkillQuery } from './skills.type';

import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { readFile } from 'fs/promises';

@Injectable()
export class SkillsService {
  async getSkill(id: string) {
    const skillsJson = await readFile(join(process.cwd(), 'db/skills.json'), {
      encoding: 'utf-8',
    });

    const skills = JSON.parse(skillsJson) as TSkill[];

    return skills.find((skill) => skill.id === id);
  }

  async getSkills(query: TSkillQuery) {
    const skillsJson = await readFile(join(process.cwd(), 'db/skills.json'), {
      encoding: 'utf-8',
    });

    let skills = JSON.parse(skillsJson) as TSkill[];

    if (query.group) skills = await this.getSkillsByGroup(skills, query.group);

    if (query.min_progress) {
      const minProgress = parseInt(query.min_progress);

      skills = await this.getSkillsByMinProgress(
        skills,
        Number.isNaN(minProgress) ? 0 : minProgress,
      );
    }

    return skills;
  }

  async getSkillsByGroup(skills: TSkill[], group: string) {
    return skills.filter((skill) => skill.group === group);
  }

  async getSkillsByMinProgress(skills: TSkill[], progress: number) {
    return skills.filter((skill) => skill.progress >= progress);
  }
}
