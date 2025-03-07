import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { AcquiredSkillEntity } from 'src/acquired-skill/entity/acquired-skill.entity';
import { ActivityEntity } from 'src/activity/entity/activity.entity';

@Entity({ name: 'skills' })
export class SkillEntity {
  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'string', example: 'JavaScript' })
  @Column({ length: 15, unique: true })
  value: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
  })
  updatedAt: number;

  @OneToMany(() => AcquiredSkillEntity, (acquiredSkill) => acquiredSkill.skill)
  acquiredSkill: AcquiredSkillEntity;

  @ManyToMany(() => ActivityEntity, (activity) => activity.stack)
  activity: ActivityEntity[];
}
