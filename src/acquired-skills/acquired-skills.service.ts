import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcquiredSkillEntity } from './entity/acquired-skills.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

import { CreateAcquiredSkillDto } from './dto/create-acquired-skill.dto';
import { UpdateAcquiredSkillDto } from './dto/update-acquired-skill.dto';

@Injectable()
export class AcquiredSkillsService {
  constructor(
    @InjectRepository(AcquiredSkillEntity)
    private readonly acquiredSkillRepository: Repository<AcquiredSkillEntity>,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.acquiredSkillRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.acquiredSkillRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createAcquiredSkillDto: CreateAcquiredSkillDto) {
    try {
      const skill = await this.skillRepository.findOneBy({
        id: createAcquiredSkillDto.skillId,
      });

      if (!skill) {
        throw new Error(
          `Skill with id: ${createAcquiredSkillDto.skillId} doesn't exist`,
        );
      }

      const isExist = await this.acquiredSkillRepository
        .createQueryBuilder('acquired_skills')
        .where('acquired_skills.skill_id = :id', {
          id: createAcquiredSkillDto.skillId,
        })
        .getOne();

      if (isExist)
        throw new Error(`Acquired skill '${skill.name}' already exist`);

      const newAcquiredSkill = this.acquiredSkillRepository.create({
        ...createAcquiredSkillDto,
        skill: skill,
      });

      return await this.acquiredSkillRepository.save(newAcquiredSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateAcquiredSkillDto: UpdateAcquiredSkillDto) {
    try {
      const skill = await this.skillRepository.findOneBy({
        id: updateAcquiredSkillDto.skillId,
      });

      if (!skill) {
        throw new Error(
          `Skill with id: ${updateAcquiredSkillDto.skillId} doesn't exist`,
        );
      }

      const isExist = await this.acquiredSkillRepository.existsBy({ id });

      if (!isExist) {
        throw new Error(`Acquired skill with id: ${id} doesn't exist`);
      }

      const newAcquiredSkill = this.acquiredSkillRepository.create({
        ...updateAcquiredSkillDto,
        skill: skill,
      });

      return await this.acquiredSkillRepository.update(id, newAcquiredSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.acquiredSkillRepository.existsBy({ id });
      if (!isExist)
        throw new Error(`Acquired skill with id: ${id} doesn't exist`);

      return await this.acquiredSkillRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
