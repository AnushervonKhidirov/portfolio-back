import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcquiredSkillEntity } from './entity/acquired-skill.entity';
import { AcquiredSkillService } from './acquired-skill.service';
import { AcquiredSkillController } from './acquired-skill.controller';
import { AcquiredSkillHelper } from './acquired-skill.helper';
import { SkillModule } from 'src/skill/skill.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    SkillModule,
    ProfileModule,
    TypeOrmModule.forFeature([AcquiredSkillEntity]),
  ],
  providers: [AcquiredSkillService, AcquiredSkillHelper],
  controllers: [AcquiredSkillController],
})
export class AcquiredSkillModule {}
