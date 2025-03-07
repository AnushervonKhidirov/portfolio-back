import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  ValidateIf,
} from 'class-validator';

import { TaskEntity } from 'src/task/entity/task.entity';
import { AchievementEntity } from 'src/achievement/entity/achievement.entity';
import { SkillEntity } from 'src/skill/entity/skill.entity';

import { ACTIVITY_TAG, TActivityTags } from '../activity.type';

export class CreateActivityDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'About google company' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 'experience' })
  @IsEnum(ACTIVITY_TAG)
  tag: TActivityTags;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2024-02-18' })
  @IsDateString()
  @ValidateIf((date) => date !== null)
  endAt: string | null;

  @ApiProperty({ example: 1 })
  @IsNumber()
  positionId: number;

  @IsNumber({}, { each: true })
  taskIds: TaskEntity[];

  @IsNumber({}, { each: true })
  achievementIds: AchievementEntity[];

  @IsNumber({}, { each: true })
  stackIds: SkillEntity[];
}
