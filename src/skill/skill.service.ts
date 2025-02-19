import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entity/skill.entity';
import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async findOne(
    where: FindOptionsWhere<SkillEntity>,
  ): TServiceAsyncMethodReturn<SkillEntity> {
    try {
      const skill = await this.skillRepository.findOneBy(where);
      if (!skill) return [null, new NotFoundException('Skill not found')];
      return [skill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<SkillEntity>,
  ): TServiceAsyncMethodReturn<SkillEntity[]> {
    try {
      const skills = await this.skillRepository.find(options);

      if (!Array.isArray(skills)) {
        return [null, new InternalServerErrorException()];
      }

      return [skills, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(createSkillDto: CreateSkillDto): TServiceAsyncMethodReturn<SkillEntity> {
    try {
      const isExist = await this.skillRepository.existsBy({
        value: createSkillDto.value,
      });

      if (isExist) {
        return [
          null,
          new ConflictException(`Skill ${createSkillDto.value} already exist`),
        ];
      }

      const newSkill = this.skillRepository.create(createSkillDto);
      const createdSkill = await this.skillRepository.save(newSkill);
      return [createdSkill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateSkillDto: UpdateSkillDto,
  ): TServiceAsyncMethodReturn<SkillEntity> {
    try {
      const skill = await this.skillRepository.findOneBy({ id });

      if (!skill) {
        return [null, new NotFoundException(`Skill with id ${id} not found`)];
      }

      const existedSkill = await this.skillRepository.findOneBy({
        value: updateSkillDto.value,
      });

      if (existedSkill) {
        return [
          null,
          new ConflictException(
            `Skill '${updateSkillDto.value}' already exist with id ${existedSkill.id}`,
          ),
        ];
      }

      const newSkill = this.skillRepository.create({
        ...skill,
        ...updateSkillDto,
      });
      const updatedSkill = await this.skillRepository.save(newSkill);

      return [updatedSkill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): TServiceAsyncMethodReturn<SkillEntity> {
    try {
      const skill = await this.skillRepository.findOneBy({ id });
      if (!skill) {
        return [null, new NotFoundException(`Skill with id ${id} not found`)];
      }

      await this.skillRepository.delete(id);
      return [skill, null];
    } catch (err) {
      console.log(err);
    }
  }
}
