import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [UserModule, SkillsModule, ContactsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
