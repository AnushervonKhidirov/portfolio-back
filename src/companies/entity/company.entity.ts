import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { GradeEntity } from 'src/grades/entity/grade.entity';
import { PositionEntity } from 'src/positions/entity/position.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { AchievementEntity } from 'src/achievements/entity/achievement.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

import { TActivity } from '../companies.type';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 30 })
  country: string;

  @ManyToOne(() => GradeEntity, (grade) => grade.company, {
    eager: true,
  })
  @JoinColumn({ name: 'grade_id' })
  grade: GradeEntity;

  @Column({ length: 20 })
  activity: TActivity

  @Column({ nullable: true, type: 'text' })
  about?: string;

  @Column({ type: 'date', name: 'start_at' })
  startAt: Date;

  @Column({ type: 'date', name: 'end_at', nullable: true })
  endAt?: Date;

  @ManyToOne(() => PositionEntity, (position) => position.id, {
    eager: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @ManyToMany(() => TaskEntity, (task) => task.company, { eager: true })
  @JoinTable({ name: 'companies_tasks' })
  tasks: TaskEntity[];

  @ManyToMany(() => AchievementEntity, (achievement) => achievement.company, {
    eager: true,
  })
  @JoinTable({ name: 'companies_achievements' })
  achievements: AchievementEntity[];

  @ManyToMany(() => SkillEntity, (skill) => skill.companyStack, { eager: true })
  @JoinTable({ name: 'companies_stack' })
  stack: SkillEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
