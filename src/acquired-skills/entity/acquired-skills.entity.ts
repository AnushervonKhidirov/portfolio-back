import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SkillEntity } from 'src/skills/entity/skill.entity';

@Entity({ name: 'acquired_skills' })
export class AcquiredSkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'tinyint' })
  progress: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => SkillEntity, (skill) => skill.acquiredSkill, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;
}
