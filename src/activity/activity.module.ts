import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityEntity } from './entity/activity.entity';
import { PositionModule } from 'src/position/position.module';
import { ProfileModule } from 'src/profile/profile.module';
import { TaskModule } from 'src/task/task.module';
import { AchievementModule } from 'src/achievement/achievement.module';
import { SkillModule } from 'src/skill/skill.module';

@Module({
  imports: [
    PositionModule,
    ProfileModule,
    TaskModule,
    AchievementModule,
    SkillModule,
    TypeOrmModule.forFeature([ActivityEntity]),
  ],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
