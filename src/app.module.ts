import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [UserModule, SkillsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
