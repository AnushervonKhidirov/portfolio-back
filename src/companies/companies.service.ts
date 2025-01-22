import type { TCompany, TCompanyResponse } from './companies.type';

import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { PositionsService } from 'src/positions/positions.service';
import { TasksService } from 'src/tasks/tasks.service';
import { AchievementsService } from 'src/achievements/achievements.service';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly tasksService: TasksService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async findOne(id: string) {
    const companies = await this.findAll();
    return companies.find((company) => company.id === id);
  }

  async findAll() {
    const companiesJson = await readFile(
      join(process.cwd(), EndpointDB.Companies),
      { encoding: 'utf-8' },
    );

    return JSON.parse(companiesJson) as TCompany[];
  }

  private async getCompanyResponse(companies: TCompany[]) {
    const result: TCompanyResponse[] = [];

    return result;
  }
}
