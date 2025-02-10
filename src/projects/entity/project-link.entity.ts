import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

import { ProjectEntity } from './project.entity';

@Entity({ name: 'project_links' })
export class ProjectLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  href: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => ProjectEntity, (project) => project.links)
  project: ProjectEntity;
}
