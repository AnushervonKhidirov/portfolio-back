import type { TProject, TProjectResponse } from './projects.type';

import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { join } from 'path';

import { SkillsService } from 'src/skills/skills.service';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class ProjectsService {
  constructor(private readonly skillsService: SkillsService) {}

  async findOne(id: string) {
    const projects = await this.findAll();

    return projects.find((project) => project.id === id);
  }

  async findAll() {
    const projectsJson = await readFile(
      join(process.cwd(), EndpointDB.Projects),
      { encoding: 'utf-8' },
    );

    const projects = JSON.parse(projectsJson) as TProject[];
    const projectsResponse = await this.getProjectsResponse(projects);

    return projectsResponse;
  }

  private async getProjectResponse(company: TProject) {
    const allStacks = await this.skillsService.getAvailableSkills();

    const stacks = allStacks.filter((stack) =>
      company.stackIds.includes(stack.id),
    );

    const projectResponse = {
      ...company,
      stacks,
    } as TProjectResponse;

    delete projectResponse.stackIds;

    return projectResponse;
  }

  private async getProjectsResponse(
    projects: TProject[],
    index: number = 0,
    projectsResponse: TProjectResponse[] = [],
  ): Promise<TProjectResponse[]> {
    if (projectsResponse.length === projects.length) return projectsResponse;
    const projectResponse = await this.getProjectResponse(projects[index]);
    const newCompaniesResponse = [...projectsResponse, projectResponse];
    return this.getProjectsResponse(projects, index + 1, newCompaniesResponse);
  }
}
