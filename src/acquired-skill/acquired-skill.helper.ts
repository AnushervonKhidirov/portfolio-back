import { BadRequestException, Injectable } from '@nestjs/common';
import { SkillService } from 'src/skill/skill.service';
import { AcquiredSkillEntity } from './entity/acquired-skill.entity';
import { SkillEntity } from 'src/skill/entity/skill.entity';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class AcquiredSkillHelper {
  constructor(
      private readonly skillService: SkillService,
    ) {}
  
    async getSkill(
      id?: number,
      acquired?: AcquiredSkillEntity,
    ): TServiceAsyncMethodReturn<SkillEntity> {
      if (!id && !acquired) return [null, new BadRequestException()];
      if (!id && acquired) return [acquired.skill, null];
  
      const [skill, err] = await this.skillService.findOne({ id });
      if (err) return [null, err];
      return [skill, null];
    }
}
