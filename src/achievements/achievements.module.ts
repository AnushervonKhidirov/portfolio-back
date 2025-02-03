import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './entity/achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementEntity])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
