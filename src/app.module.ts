import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { ContactsModule } from './contacts/contacts.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { PositionsModule } from './positions/positions.module';
import { GradesModule } from './grades/grades.module';
import { TasksModule } from './tasks/tasks.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    UserModule,
    SkillsModule,
    ContactsModule,
    SocialLinksModule,
    PositionsModule,
    GradesModule,
    TasksModule,
    AchievementsModule,
    CompaniesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
