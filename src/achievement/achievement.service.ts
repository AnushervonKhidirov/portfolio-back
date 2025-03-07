import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';

import { AchievementEntity } from './entity/achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
  ) {}

  async findOne(
    where: FindOptionsWhere<AchievementEntity>,
  ): TServiceAsyncMethodReturn<AchievementEntity> {
    const achievement = await this.achievementRepository.findOneBy(where);
    if (!achievement) return [null, new NotFoundException('Achievement not found')];
    return [achievement, null];
  }

  async findAll(
    options?: FindManyOptions<AchievementEntity>,
  ): TServiceAsyncMethodReturn<AchievementEntity[]> {
    const achievements = await this.achievementRepository.find(options);

    if (!Array.isArray(achievements)) {
      return [null, new InternalServerErrorException()];
    }

    return [achievements, null];
  }

  async create(
    createAchievementDto: CreateAchievementDto,
  ): TServiceAsyncMethodReturn<AchievementEntity> {
    const now = Date.now();

    const newAchievement = this.achievementRepository.create({
      ...createAchievementDto,
      createdAt: now,
      updatedAt: now,
    });

    const achievement = await this.achievementRepository.save(newAchievement);

    if (!achievement) {
      return [null, new InternalServerErrorException('Unable to create achievement')];
    }

    return [achievement, null];
  }

  async update(
    id: number,
    updateAchievementDto: UpdateAchievementDto,
  ): TServiceAsyncMethodReturn<AchievementEntity> {
    const isExist = await this.achievementRepository.existsBy({ id });
    if (!isExist) return [null, new NotFoundException('Achievement not found')];

    const updatedAchievement = this.achievementRepository.create({
      ...updateAchievementDto,
      updatedAt: Date.now(),
    });

    const achievement = await this.achievementRepository.save(updatedAchievement);

    if (!achievement) {
      return [null, new InternalServerErrorException('Unable to update achievement')];
    }

    return [achievement, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<AchievementEntity> {
    const [achievement, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.achievementRepository.delete(id);

    if (!result.affected) {
      return [null, new InternalServerErrorException('Unable to delete achievement')];
    }

    return [achievement, null];
  }
}
