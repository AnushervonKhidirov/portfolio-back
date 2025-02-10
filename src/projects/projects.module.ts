import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entity/project.entity';
import { ProjectLinkEntity } from './entity/project-link.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ProjectLinkEntity, SkillEntity])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
