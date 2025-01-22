import type {
  TSkill,
  TSkillQuery,
  TAvailableSkills,
  TSkillResponse,
  TSkillTypes,
} from './skills.type';

import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { readFile } from 'fs/promises';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class SkillsService {
  async getSkill(id: string) {
    const skills = await this.getSkills();
    return skills.find((skill) => skill.id === id);
  }

  async getSkills(query?: TSkillQuery) {
    const skillsJson = await readFile(join(process.cwd(), EndpointDB.Skills), {
      encoding: 'utf-8',
    });

    let skills = await this.getSkillsResponse(
      JSON.parse(skillsJson) as TSkill[],
    );

    if (query?.type) {
      skills = await this.getSkillsByType(skills, query.type);
    }

    if (query?.min_progress) {
      const minProgress = parseInt(query.min_progress);

      skills = await this.getSkillsByMinProgress(
        skills,
        Number.isNaN(minProgress) ? 0 : minProgress,
      );
    }

    return skills;
  }

  async getAvailableSkills() {
    const skillsJson = await readFile(
      join(process.cwd(), EndpointDB.SkillAvailable),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(skillsJson) as TAvailableSkills[];
  }

  async getSkillTypes() {
    const skillsJson = await readFile(
      join(process.cwd(), EndpointDB.SkillTypes),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(skillsJson) as TSkillTypes[];
  }

  private async getSkillsResponse(skills: TSkill[]) {
    const convertedAvailableSkills = this.convertToObject(
      await this.getAvailableSkills(),
    );

    const convertedSkillTypes = this.convertToObject(
      await this.getSkillTypes(),
    );

    let skillResponse = [...skills] as TSkillResponse[];

    skillResponse = skillResponse.map((skill) => {
      skill.skill = convertedAvailableSkills[skill.skillId];
      skill.type = convertedSkillTypes[skill.typeId];

      delete skill.skillId;
      delete skill.typeId;

      return skill;
    });

    return skillResponse;
  }

  private convertToObject(dataList: { id: string; value: string }[]) {
    const result: { [key: string]: string } = {};

    dataList.forEach((data) => {
      result[data.id] = data.value;
    });

    return result;
  }

  private async getSkillsByType(skills: TSkillResponse[], type: string) {
    return skills.filter((skill) => skill.type === type);
  }

  private async getSkillsByMinProgress(
    skills: TSkillResponse[],
    progress: number,
  ) {
    return skills.filter((skill) => skill.progress >= progress);
  }
}
