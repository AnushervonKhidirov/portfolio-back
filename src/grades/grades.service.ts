import type { TGrade } from './grades.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class GradesService {
  async findOne(id: string) {
    const grades = await this.findAll();
    return grades.find((grade) => grade.id === id);
  }

  async findAll() {
    const gradesJson = await readFile(join(process.cwd(), EndpointDB.Grades), {
      encoding: 'utf-8',
    });

    return JSON.parse(gradesJson) as TGrade[];
  }
}
