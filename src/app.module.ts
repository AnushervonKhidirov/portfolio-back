import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { ContactsModule } from './contacts/contacts.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [UserModule, SkillsModule, ContactsModule, SocialLinksModule, PositionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
