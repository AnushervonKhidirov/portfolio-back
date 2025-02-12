import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

import { SkillEntity } from './entity/skill.entity';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.skillRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.skillRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async findMany(condition: FindManyOptions<SkillEntity>) {
    try {
      return await this.skillRepository.find(condition);
    } catch (err) {
      console.log(err);
    }
  }

  async create(createSkillDto: CreateSkillDto) {
    try {
      const isExist = await this.skillRepository.existsBy({
        name: createSkillDto.name,
      });

      if (isExist) {
        throw new Error(`Skill '${createSkillDto.name}' already exist`);
      }

      const newSkill = this.skillRepository.create(createSkillDto);
      return await this.skillRepository.save(newSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    try {
      const skill = await this.skillRepository.findOneBy({ id });
      if (!skill) throw new Error(`Skill with id: ${id} doesn't exist`);

      const updatedSkill = this.skillRepository.create({
        ...skill,
        ...updateSkillDto,
      });

      return await this.skillRepository.save(updatedSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.skillRepository.existsBy({ id });
      if (!isExist) throw new Error(`Skill with id: ${id} doesn't exist`);

      return await this.skillRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
