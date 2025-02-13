import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { TSkillType } from '../acquired-skills.type';

import { SkillEntity } from 'src/skills/entity/skill.entity';

@Entity({ name: 'acquired_skills' })
export class AcquiredSkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'skill_id' })
  skillId: string;

  @Column({ type: 'tinyint' })
  progress: number;

  @Column({ name: 'skill_type' })
  skillType: TSkillType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => SkillEntity, (skill) => skill.acquiredSkill, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;
}
