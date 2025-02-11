import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { ProjectEntity } from './entity/project.entity';
import { ProjectLinkEntity } from './entity/project-link.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectLinkDto } from './dto/create-project-link.dto';

@Injectable()
export class ProjectsService {
  uploadsPath: string = 'uploads/images/projects';
  imageRequestPath: string = 'projects/image';

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(ProjectLinkEntity)
    private readonly projectLinkRepository: Repository<ProjectLinkEntity>,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
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
      const stack = await this.getStack(createProjectDto.stackIds);
      const links = await this.createProjectLinks(createProjectDto.links);

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
      const stack = await this.getStack(updateProjectDto.stackIds);

      const newProject = this.projectRepository.create({
        ...updateProjectDto,
        stack,
      });

      return await this.projectRepository.update(id, newProject);
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

  private async getStack(ids: string[]) {
    try {
      const stack = await this.skillRepository
        .createQueryBuilder('skills')
        .where('skills.id In (:...ids)', { ids })
        .getMany();

      if (!stack || stack.length === 0) throw new Error("Stack doesn't exist");
      return stack;
    } catch (err) {
      console.log(err);
    }
  }

  private async createProjectLinks(
    createProjectLinkDto: CreateProjectLinkDto[],
  ) {
    try {
      const newLinks = this.projectLinkRepository.create(createProjectLinkDto);
      return await this.projectLinkRepository.save(newLinks);
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
