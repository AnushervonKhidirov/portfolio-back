import type { TCompany, TCompanyResponse } from './companies.type';

import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { PositionsService } from 'src/positions/positions.service';
import { TasksService } from 'src/tasks/tasks.service';
import { AchievementsService } from 'src/achievements/achievements.service';
import { SkillsService } from 'src/skills/skills.service';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly tasksService: TasksService,
    private readonly achievementsService: AchievementsService,
    private readonly skillsService: SkillsService,
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

    const companies = JSON.parse(companiesJson) as TCompany[];
    const companiesResponse = await this.getCompaniesResponse(companies);

    return companiesResponse;
  }

  private async getCompanyResponse(company: TCompany) {
    const position = await this.positionsService.findOne(company.positionId);
    const allTasks = await this.tasksService.findAll();
    const allStacks = await this.skillsService.getAvailableSkills();

    const tasks = allTasks.filter((task) => company.tasksIds.includes(task.id));

    const stacks = allStacks.filter((stack) =>
      company.stackIds.includes(stack.id),
    );

    const companyResponse = {
      ...company,
      position: position.value,
      tasks,
      stacks,
    } as TCompanyResponse;

    if (company.achievementsIds) {
      const allAchievements = await this.achievementsService.findAll();
      companyResponse.achievements = allAchievements.filter((achievement) =>
        company.achievementsIds.includes(achievement.id),
      );
    }

    delete companyResponse.positionId;
    delete companyResponse.tasksIds;
    delete companyResponse.achievementsIds;
    delete companyResponse.stackIds;

    return companyResponse;
  }

  private async getCompaniesResponse(
    companies: TCompany[],
    index: number = 0,
    companiesResponse: TCompanyResponse[] = [],
  ): Promise<TCompanyResponse[]> {
    if (companiesResponse.length === companies.length) return companiesResponse;
    const companyResponse = await this.getCompanyResponse(companies[index]);
    const newCompaniesResponse = [...companiesResponse, companyResponse];
    return this.getCompaniesResponse(
      companies,
      index + 1,
      newCompaniesResponse,
    );
  }
}
