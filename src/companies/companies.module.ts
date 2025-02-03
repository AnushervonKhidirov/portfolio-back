import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

import { CompanyEntity } from './entity/company.entity';
import { GradeEntity } from 'src/grades/entity/grade.entity';
import { PositionEntity } from 'src/positions/entity/position.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { AchievementEntity } from 'src/achievements/entity/achievement.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      GradeEntity,
      PositionEntity,
      TaskEntity,
      AchievementEntity,
      SkillEntity,
    ]),
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
