import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SkillEntity } from './skills/entity/skill.entity';
import { AcquiredSkillEntity } from './acquired-skills/entity/acquired-skills.entity';
import { PositionEntity } from './positions/entity/position.entity';
import { GradeEntity } from './grades/entity/grade.entity';
import { TaskEntity } from './tasks/entity/task.entity';
import { AchievementEntity } from './achievements/entity/achievement.entity';

import { SkillsModule } from './skills/skills.module';
import { PositionsModule } from './positions/positions.module';
import { GradesModule } from './grades/grades.module';
import { AcquiredSkillsModule } from './acquired-skills/acquired-skills.module';
import { TasksModule } from './tasks/tasks.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        SkillEntity,
        AcquiredSkillEntity,
        PositionEntity,
        GradeEntity,
        TaskEntity,
        AchievementEntity,
      ],
      synchronize: true,
    }),
    SkillsModule,
    PositionsModule,
    GradesModule,
    AcquiredSkillsModule,
    TasksModule,
    AchievementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
