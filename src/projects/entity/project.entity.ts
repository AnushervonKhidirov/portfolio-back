import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { SkillEntity } from 'src/skills/entity/skill.entity';
import { ProjectLinkEntity } from './project-link.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => SkillEntity, (skill) => skill.projectStack, { eager: true })
  @JoinTable({ name: 'projects_stacks' })
  stack: SkillEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => ProjectLinkEntity, (projectLink) => projectLink.project, {
    eager: true,
  })
  @JoinTable()
  links: ProjectLinkEntity[];
}
