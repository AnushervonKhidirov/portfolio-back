import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AchievementEntity } from './entity/achievement.entity';

import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.achievementRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.achievementRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createAchievementDto: CreateAchievementDto) {
    try {
      const isExist = await this.achievementRepository.existsBy({
        name: createAchievementDto.name,
      });

      if (isExist) throw new Error('Achievement already exist');

      const newAchievement =
        this.achievementRepository.create(createAchievementDto);

      return await this.achievementRepository.save(newAchievement);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateAchievementDto: UpdateAchievementDto) {
    try {
      const achievement = await this.achievementRepository.findOneBy({ id });
      if (!achievement)
        throw new Error(`Achievement with id ${id} doesn't exist`);

      const updatedAchievement = this.achievementRepository.create({
        ...achievement,
        ...updateAchievementDto,
      });

      return await this.achievementRepository.save(updatedAchievement);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.achievementRepository.existsBy({ id });
      if (!isExist) throw new Error(`Achievement with id ${id} doesn't exist`);

      return await this.achievementRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
