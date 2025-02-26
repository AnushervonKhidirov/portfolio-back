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
    const skill = await this.skillRepository.findOneBy(where);
    if (!skill) return [null, new NotFoundException('Skill not found')];
    return [skill, null];
  }

  async findAll(
    options?: FindManyOptions<SkillEntity>,
  ): TServiceAsyncMethodReturn<SkillEntity[]> {
    const skills = await this.skillRepository.find(options);

    if (!Array.isArray(skills)) {
      return [null, new InternalServerErrorException()];
    }

    return [skills, null];
  }

  async create(
    createSkillDto: CreateSkillDto,
  ): TServiceAsyncMethodReturn<SkillEntity> {
    const isExist = await this.skillRepository.existsBy({
      value: createSkillDto.value,
    });

    if (isExist) {
      return [
        null,
        new ConflictException(`Skill ${createSkillDto.value} already exist`),
      ];
    }

    const now = Date.now();

    const newSkill = this.skillRepository.create({
      ...createSkillDto,
      createdAt: now,
      updatedAt: now,
    });

    const createdSkill = await this.skillRepository.save(newSkill);
    if (!createdSkill) return [null, new InternalServerErrorException()];

    return [createdSkill, null];
  }

  async update(
    id: number,
    updateSkillDto: UpdateSkillDto,
  ): TServiceAsyncMethodReturn<SkillEntity> {
    const [skill, skillErr] = await this.findOne({ id });
    if (skillErr) return [null, skillErr];

    const [existedSkill] = await this.findOne({
      value: updateSkillDto.value,
    });

    if (existedSkill) {
      return [
        null,
        new ConflictException(
          `Skill '${updateSkillDto.value}' already exist by id ${existedSkill.id}`,
        ),
      ];
    }

    const newSkill = this.skillRepository.create({
      ...skill,
      ...updateSkillDto,
      updatedAt: Date.now(),
    });

    const updatedSkill = await this.skillRepository.save(newSkill);
    if (!updatedSkill) return [null, new InternalServerErrorException()];

    return [updatedSkill, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<SkillEntity> {
    const [skill, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.skillRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [skill, null];
  }
}
