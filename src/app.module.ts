import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from './middleware/logger.middleware';

import { SkillEntity } from './skills/entity/skill.entity';
import { AcquiredSkillEntity } from './acquired-skills/entity/acquired-skills.entity';
import { PositionEntity } from './positions/entity/position.entity';
import { GradeEntity } from './grades/entity/grade.entity';
import { TaskEntity } from './tasks/entity/task.entity';
import { AchievementEntity } from './achievements/entity/achievement.entity';
import { CompanyEntity } from './companies/entity/company.entity';
import { UserEntity } from './user/entity/user.entity';
import { TokenEntity } from './token/entity/token.entity';

import { SkillsModule } from './skills/skills.module';
import { AcquiredSkillsModule } from './acquired-skills/acquired-skills.module';
import { PositionsModule } from './positions/positions.module';
import { GradesModule } from './grades/grades.module';
import { TasksModule } from './tasks/tasks.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';

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
        CompanyEntity,
        UserEntity,
        TokenEntity,
      ],
      synchronize: true,
    }),
    SkillsModule,
    PositionsModule,
    GradesModule,
    AcquiredSkillsModule,
    TasksModule,
    AchievementsModule,
    CompaniesModule,
    AuthModule,
    UserModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '*', method: RequestMethod.GET }, 'auth/*')
      .forRoutes('*');
  }
}
