import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skills/entity/skill.entity';

import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { ContactsModule } from './contacts/contacts.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { PositionsModule } from './positions/positions.module';
import { GradesModule } from './grades/grades.module';
import { TasksModule } from './tasks/tasks.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CompaniesModule } from './companies/companies.module';
import { ProjectsModule } from './projects/projects.module';

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
      entities: [Skill],
      synchronize: true,
    }),
    UserModule,
    SkillsModule,
    ContactsModule,
    SocialLinksModule,
    PositionsModule,
    GradesModule,
    TasksModule,
    AchievementsModule,
    CompaniesModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
