import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { PositionEntity } from 'src/position/entity/position.entity';
import { ProfileEntity } from 'src/profile/entity/profile.entity';
import { TaskEntity } from 'src/task/entity/task.entity';
import { AchievementEntity } from 'src/achievement/entity/achievement.entity';
import { SkillEntity } from 'src/skill/entity/skill.entity';

import { ACTIVITY_TAG } from '../activity.type';

@Entity({ name: 'activities' })
export class ActivityEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: ACTIVITY_TAG.EXPERIENCE })
  @Column({ type: 'enum', enum: ACTIVITY_TAG })
  tag: ACTIVITY_TAG;

  @ApiProperty({ example: 'Google' })
  @Column({ length: 30 })
  name: string;

  @ApiProperty({ example: '2024-01-01' })
  @Column({ name: 'start_at', type: 'date' })
  startAt: Date;

  @ApiProperty({ example: '2024-02-18' })
  @Column({ name: 'end_at', type: 'date' })
  endAt: Date;

  @ApiProperty({ example: 'About google company' })
  @Column({ type: 'text' })
  about: string;

  @ApiProperty({ example: 1740024934772 })
  @Column({
    name: 'created_at',
    type: 'bigint',
  })
  createdAt: number;

  @ApiProperty({ example: 1740024934772 })
  @Column({
    name: 'updated_at',
    type: 'bigint',
  })
  updatedAt: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'position_id' })
  positionId: number;

  @ManyToOne(() => PositionEntity, (position) => position.activity, {
    eager: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @ApiProperty({ example: 1 })
  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile.activity, {
    eager: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;

  @ManyToMany(() => TaskEntity, (task) => task.activity)
  @JoinTable({ name: 'activities_tasks' })
  tasks: TaskEntity[];

  @ManyToMany(() => AchievementEntity, (achievement) => achievement)
  @JoinTable({ name: 'activities_achievements' })
  achievements: AchievementEntity[];

  @ManyToMany(() => SkillEntity, (stack) => stack.activity)
  @JoinTable({ name: 'activities_stack' })
  stack: SkillEntity[];
}
