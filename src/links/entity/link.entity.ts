import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';

import { ProjectEntity } from 'src/projects/entity/project.entity';

@Entity({ name: 'links' })
export class LinkEntity {
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
