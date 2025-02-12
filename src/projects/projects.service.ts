import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { ProjectEntity } from './entity/project.entity';
import { LinksService } from 'src/links/links.service';
import { SkillsService } from 'src/skills/skills.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  uploadsPath: string = 'uploads/images/projects';
  imageRequestPath: string = 'projects/image';

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    private readonly skillsService: SkillsService,
    private readonly linksService: LinksService,
  ) {}

  async findOne(id: string) {
    try {
      return await this.projectRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.projectRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async uploadImage(imageFile: Express.Multer.File) {
    try {
      const extension = imageFile.originalname.split('.')[1];
      const imageName = `${uuid()}.${extension}`;
      const path = join(process.cwd(), this.uploadsPath, imageName);
      const imagePath = join('/', this.imageRequestPath, imageName);

      await this.createFoldersIfNotExist();
      await writeFile(path, imageFile.buffer);

      return { imagePath };
    } catch (err) {
      console.log(err);
    }
  }

  async findImage(imageName: string) {
    try {
      const path = join(process.cwd(), this.uploadsPath, imageName);
      const isExist = existsSync(path);

      if (!isExist) throw new Error(`Image '${imageName}' doesn't exist`);
      return path;
    } catch (err) {
      console.log(err);
    }
  }

  async create(createProjectDto: CreateProjectDto) {
    try {
      const stack = await this.skillsService.findMany({
        where: { id: In([...createProjectDto.stackIds]) },
      });

      const links = await this.linksService.createMany(createProjectDto.links);

      const newProject = this.projectRepository.create({
        ...createProjectDto,
        stack,
        links,
      });

      return await this.projectRepository.save(newProject);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOneBy({ id });
      if (!project) throw new Error('Project not found');

      const stack = updateProjectDto.stackIds
        ? await this.skillsService.findMany({
            where: { id: In([...updateProjectDto.stackIds]) },
          })
        : project.stack;

      if (!stack) throw new Error('Stack not found');

      const updatedProject = this.projectRepository.create({
        ...project,
        ...updateProjectDto,
        stack,
      });

      return await this.projectRepository.save(updatedProject);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      return await this.projectRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }

  private async createFoldersIfNotExist() {
    try {
      const path = join(process.cwd(), this.uploadsPath);
      const isExist = existsSync(path);
      if (!isExist) await mkdir(path, { recursive: true });
    } catch (err) {
      console.log(err);
    }
  }
}
