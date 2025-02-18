import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entity/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async findOne(where: FindOptionsWhere<SkillEntity>) {
    try {
      return await this.skillRepository.findOneBy(where);
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(options?: FindManyOptions<SkillEntity>) {
    try {
      return await this.skillRepository.find(options);
    } catch (err) {
      console.log(err);
    }
  }

  async create(createSkillDto: CreateSkillDto) {
    try {
      const isExist = await this.skillRepository.existsBy({
        value: createSkillDto.value,
      });

      if (isExist) {
        throw new Error(`Skill ${createSkillDto.value} already exist`);
      }

      const newSkill = this.skillRepository.create(createSkillDto);
      return await this.skillRepository.save(newSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateSkillDto: UpdateSkillDto,
  ): Promise<SkillEntity> {
    try {
      const skill = await this.findOne({ id });

      if (!skill) {
        throw new Error(`Skill with id ${id} doesn't exist`);
      }

      const newSkill = this.skillRepository.create({
        ...skill,
        ...updateSkillDto,
      });

      return await this.skillRepository.save(newSkill);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number) {
    try {
      const skill = await this.findOne({ id });

      if (!skill) throw new Error("Skill doesn't exist");

      await this.skillRepository.delete(id);
      return skill;
    } catch (err) {
      console.log(err);
    }
  }
}
