import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillEntity } from './entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity])],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
