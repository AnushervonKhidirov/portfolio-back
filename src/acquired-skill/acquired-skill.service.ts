import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateAcquiredSkillDto } from './dto/create-acquired-skill.dto';
import { UpdateAcquiredSkillDto } from './dto/update-acquired-skill.dto';
import { AcquiredSkillEntity } from './entity/acquired-skill.entity';
import { AcquiredSkillHelper } from './acquired-skill.helper';
import { ProfileService } from 'src/profile/profile.service';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class AcquiredSkillService {
  constructor(
    @InjectRepository(AcquiredSkillEntity)
    private readonly acquiredSkillRepository: Repository<AcquiredSkillEntity>,

    private readonly acquiredSkillHelper: AcquiredSkillHelper,
    private readonly profileService: ProfileService,
  ) {}

  async findOne(
    where: FindOptionsWhere<AcquiredSkillEntity>,
  ): TServiceAsyncMethodReturn<AcquiredSkillEntity> {
    try {
      const acquiredSkill = await this.acquiredSkillRepository.findOneBy(where);

      if (!acquiredSkill) {
        return [null, new NotFoundException('Acquired skill not found')];
      }

      return [acquiredSkill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<AcquiredSkillEntity>,
  ): TServiceAsyncMethodReturn<AcquiredSkillEntity[]> {
    try {
      const acquiredSkills = await this.acquiredSkillRepository.find(options);

      if (!Array.isArray(acquiredSkills)) {
        return [null, new InternalServerErrorException()];
      }

      return [acquiredSkills, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    createAcquiredSkillDto: CreateAcquiredSkillDto,
    profileRelationId: number,
  ): TServiceAsyncMethodReturn<AcquiredSkillEntity> {
    try {
      const [profile, profileErr] = await this.profileService.findOne({
        id: profileRelationId,
      });
      if (profileErr) return [null, profileErr];

      const [skill, skillErr] = await this.acquiredSkillHelper.getSkill(
        createAcquiredSkillDto.skillId,
      );
      if (skillErr) return [null, skillErr];

      const now = Date.now();

      const newAcquiredSkill = this.acquiredSkillRepository.create({
        ...createAcquiredSkillDto,
        skill,
        profile,
        createdAt: now,
        updatedAt: now,
      });

      const createdAcquiredSkill =
        await this.acquiredSkillRepository.save(newAcquiredSkill);

      if (!createdAcquiredSkill) {
        return [null, new InternalServerErrorException()];
      }

      return [createdAcquiredSkill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateAcquiredSkillDto: UpdateAcquiredSkillDto,
  ): TServiceAsyncMethodReturn<AcquiredSkillEntity> {
    try {
      const acquiredSkill = await this.acquiredSkillRepository.findOneBy({
        id,
      });

      if (!acquiredSkill) {
        return [null, new NotFoundException('Acquired skill not found')];
      }

      const [skill, skillErr] = await this.acquiredSkillHelper.getSkill(
        updateAcquiredSkillDto.skillId,
        acquiredSkill,
      );

      if (skillErr) return [null, skillErr];

      const newAcquiredSkill = this.acquiredSkillRepository.create({
        ...updateAcquiredSkillDto,
        skill,
        updatedAt: Date.now(),
      });

      const updatedAcquiredSkill =
        await this.acquiredSkillRepository.save(newAcquiredSkill);

      if (!updatedAcquiredSkill) {
        return [null, new InternalServerErrorException()];
      }

      return [updatedAcquiredSkill, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): TServiceAsyncMethodReturn<AcquiredSkillEntity> {
    try {
      const acquiredSkill = await this.acquiredSkillRepository.findOneBy({
        id,
      });

      if (!acquiredSkill) {
        return [null, new NotFoundException('Acquired skill not found')];
      }

      const result = await this.acquiredSkillRepository.delete(id);
      if (!result) return [null, new InternalServerErrorException()];

      return [acquiredSkill, null];
    } catch (err) {
      console.log(err);
    }
  }
}
