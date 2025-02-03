import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { CompanyEntity } from 'src/companies/entity/company.entity';

@Entity({ name: 'grades' })
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => CompanyEntity, (company) => company.grade)
  company: CompanyEntity;
}
