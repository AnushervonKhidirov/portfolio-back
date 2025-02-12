import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entity/project.entity';
import { LinksModule } from 'src/links/links.module';
import { SkillsModule } from 'src/skills/skills.module';

@Module({
  imports: [SkillsModule, LinksModule, TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
