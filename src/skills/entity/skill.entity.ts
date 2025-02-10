import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { AcquiredSkillEntity } from 'src/acquired-skills/entity/acquired-skills.entity';
import { CompanyEntity } from 'src/companies/entity/company.entity';
import { ProjectEntity } from 'src/projects/entity/project.entity';

@Entity({ name: 'skills' })
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: '20' })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => AcquiredSkillEntity, (acquiredSkill) => acquiredSkill.skill)
  acquiredSkill: AcquiredSkillEntity;

  @ManyToMany(() => CompanyEntity, (company) => company.stack)
  companyStack: CompanyEntity[];

  @ManyToMany(() => ProjectEntity, (project) => project.stack)
  projectStack: ProjectEntity[];
}
