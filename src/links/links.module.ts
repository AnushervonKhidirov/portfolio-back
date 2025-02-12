import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from './links.service';

import { LinkEntity } from './entity/link.entity';
import { ProjectEntity } from 'src/projects/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity, ProjectEntity])],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
