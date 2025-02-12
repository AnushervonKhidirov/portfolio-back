import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { SkillEntity } from 'src/skills/entity/skill.entity';
import { LinkEntity } from 'src/links/entity/link.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => SkillEntity, (skill) => skill.projectStack, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'projects_stacks' })
  stack: SkillEntity[];

  @ManyToMany(() => LinkEntity, (projectLink) => projectLink.project, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'project_links' })
  links: LinkEntity[];
}
