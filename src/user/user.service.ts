import type { TUser, TUserResponse } from './user.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { PositionsService } from 'src/positions/positions.service';
import { GradesService } from 'src/grades/grades.service';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class UserService {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly gradesService: GradesService,
  ) {}

  async findOne() {
    const userInfoJson = await readFile(
      join(process.cwd(), EndpointDB.UserInfo),
      {
        encoding: 'utf-8',
      },
    );

    const user = JSON.parse(userInfoJson) as TUser;
    const userResponse = this.getUserResponseData(user);

    return userResponse;
  }

  private async getUserResponseData(user: TUser) {
    const userGrade = await this.gradesService.findOne(user.gradeId);
    const userPosition = await this.positionsService.findOne(user.positionId);

    const userResponse = { ...user } as TUserResponse;

    delete userResponse.gradeId;
    delete userResponse.positionId;

    userResponse.grade = userGrade.value;
    userResponse.position = userPosition.value;

    return userResponse;
  }
}
