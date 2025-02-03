import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

import { CompanyEntity } from 'src/companies/entity/company.entity';

@Entity({ name: 'achievements' })
export class AchievementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  value: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => CompanyEntity, (company) => company.achievements)
  company: CompanyEntity[]
}
