import { BadRequestException, Injectable } from '@nestjs/common';

import { PositionService } from 'src/position/position.service';
import { GradeService } from 'src/grade/grade.service';

import { ProfileEntity } from './entity/profile.entity';
import { PositionEntity } from 'src/position/entity/position.entity';
import { GradeEntity } from 'src/grade/entity/grade.entity';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class ProfileHelper {
  constructor(
    private readonly positionService: PositionService,
    private readonly gradeService: GradeService,
  ) {}

  async getPosition(
    id?: number,
    profile?: ProfileEntity,
  ): TServiceAsyncMethodReturn<PositionEntity> {
    if (!id && !profile) return [null, new BadRequestException()];
    if (!id && profile) return [profile.position, null];

    const [position, err] = await this.positionService.findOne({ id });
    if (err) return [null, err];
    return [position, null];
  }

  async getGrade(
    id?: number,
    profile?: ProfileEntity,
  ): TServiceAsyncMethodReturn<GradeEntity> {
    if (!id && !profile) return [null, new BadRequestException()];
    if (!id && profile) return [profile.grade, null];

    const [grade, err] = await this.gradeService.findOne({ id });
    if (err) return [null, err];
    return [grade, null];
  }
}
