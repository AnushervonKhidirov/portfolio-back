import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

import { PositionsModule } from 'src/positions/positions.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  imports: [PositionsModule, TasksModule, AchievementsModule, SkillsModule],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
