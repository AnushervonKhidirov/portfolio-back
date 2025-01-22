import type { TTask } from './tasks.type';

import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class TasksService {
  async findOne(id: string) {
    const tasksJson = await this.findAll();
    return tasksJson.find((achievement) => achievement.id === id);
  }

  async findAll() {
    const tasksJson = await readFile(join(process.cwd(), EndpointDB.Tasks), {
      encoding: 'utf-8',
    });

    return JSON.parse(tasksJson) as TTask[];
  }
}
