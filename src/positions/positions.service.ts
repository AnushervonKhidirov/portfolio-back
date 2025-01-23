import type { TPosition } from './positions.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class PositionsService {
  async findOne(id: string) {
    const positions = await this.findAll();
    return positions.find((position) => position.id === id);
  }

  async findAll() {
    const positionsJson = await readFile(
      join(process.cwd(), EndpointDB.Positions),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(positionsJson) as TPosition[];
  }
}
