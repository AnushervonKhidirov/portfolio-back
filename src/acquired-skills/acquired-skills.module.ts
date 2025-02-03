import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcquiredSkillsController } from './acquired-skills.controller';
import { AcquiredSkillsService } from './acquired-skills.service';
import { AcquiredSkillEntity } from './entity/acquired-skills.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcquiredSkillEntity, SkillEntity])],
  controllers: [AcquiredSkillsController],
  providers: [AcquiredSkillsService],
})
export class AcquiredSkillsModule {}
