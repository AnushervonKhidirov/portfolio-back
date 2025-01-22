import type { TAchievement } from './achievements.type';

import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class AchievementsService {
  async findOne(id: string) {
    const achievementsJson = await this.findAll();
    return achievementsJson.find((achievement) => achievement.id === id);
  }

  async findAll() {
    const achievementsJson = await readFile(
      join(process.cwd(), EndpointDB.Achievements),
      { encoding: 'utf-8' },
    );

    return JSON.parse(achievementsJson) as TAchievement[];
  }
}
