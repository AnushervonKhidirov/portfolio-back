import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Skill } from './entity/skill.entity';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
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

  async create(createSkillDto: CreateSkillDto) {
    try {
      const isExist = await this.skillRepository.existsBy({
        name: createSkillDto.name,
      });

      if (isExist) return null;

      const { generatedMaps } =
        await this.skillRepository.insert(createSkillDto);

      const createdSkill: Skill = {
        id: generatedMaps[0].id,
        createdAt: generatedMaps[0].createdAt,
        name: createSkillDto.name,
      };

      return createdSkill;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    try {
      const isExist = await this.skillRepository.existsBy({ id });
      if (!isExist) return null;

      return await this.skillRepository.update(id, updateSkillDto);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.skillRepository.existsBy({ id });
      if (!isExist) return null;

      return await this.skillRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
