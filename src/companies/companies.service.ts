import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyEntity } from './entity/company.entity';
import { GradeEntity } from 'src/grades/entity/grade.entity';
import { PositionEntity } from 'src/positions/entity/position.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { AchievementEntity } from 'src/achievements/entity/achievement.entity';
import { SkillEntity } from 'src/skills/entity/skill.entity';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,

    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,

    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,

    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,

    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,

    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.companyRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.companyRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const grade = await this.getGrade(createCompanyDto.gradeId);
      const position = await this.getPosition(createCompanyDto.positionId);
      const tasks = await this.getTasks(createCompanyDto.taskIds);
      const achievements = await this.getAchievements(
        createCompanyDto.achievementIds,
      );
      const stack = await this.getStack(createCompanyDto.stackIds);

      const newCompany = this.companyRepository.create({
        ...createCompanyDto,
        grade,
        position,
        tasks,
        achievements,
        stack,
      });

      return await this.companyRepository.save(newCompany);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const grade = await this.getGrade(updateCompanyDto.gradeId);
      const position = await this.getPosition(updateCompanyDto.positionId);
      const tasks = await this.getTasks(updateCompanyDto.taskIds);
      const achievements = await this.getAchievements(
        updateCompanyDto.achievementIds,
      );
      const stack = await this.getStack(updateCompanyDto.stackIds);

      const company = this.companyRepository.create({
        ...updateCompanyDto,
        grade,
        position,
        tasks,
        achievements,
        stack,
      });

      return await this.companyRepository.update(id, company);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.companyRepository.existsBy({ id });
      if (!isExist) throw new Error(`Company with id: ${id} doesn't exist`);
      return await this.companyRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }

  private async getGrade(id: string) {
    try {
      const grade = await this.gradeRepository.findOneBy({
        id: id,
      });

      if (!grade) {
        throw new Error(`Grade with id: ${id} doesn't exist`);
      }

      return grade;
    } catch (err) {
      console.log(err);
    }
  }

  private async getPosition(id: string) {
    try {
      const position = await this.positionRepository.findOneBy({
        id: id,
      });

      if (!position) {
        throw new Error(`Position with id: ${id} doesn't exist`);
      }

      return position;
    } catch (err) {
      console.log(err);
    }
  }

  private async getTasks(ids: string[]) {
    try {
      const tasks = await this.taskRepository
        .createQueryBuilder('tasks')
        .where('tasks.id In (:...ids)', { ids })
        .getMany();

      if (!tasks || tasks.length === 0) throw new Error("Tasks doesn't exist");
      return tasks;
    } catch (err) {
      console.log(err);
    }
  }

  private async getAchievements(ids: string[]) {
    try {
      const achievements = await this.achievementRepository
        .createQueryBuilder('achievements')
        .where('achievements.id In (:...ids)', { ids })
        .getMany();

      if (!achievements || achievements.length === 0) {
        throw new Error("Achievements doesn't exist");
      }

      return achievements;
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
}
