import type { TPosition } from './positions.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class PositionsService {
  async findAll() {
    const positionsJson = await readFile(
      join(process.cwd(), EndpointDB.Positions),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(positionsJson) as TPosition[];
  }

  async findOne(id: string) {
    const positionsJson = await readFile(
      join(process.cwd(), EndpointDB.Positions),
      {
        encoding: 'utf-8',
      },
    );

    const positions = JSON.parse(positionsJson) as TPosition[];

    return positions.find((position) => position.id === id);
  }
}
