import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GradeEntity } from './entity/grade.entity';

import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.gradeRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.gradeRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createGradeDto: CreateGradeDto) {
    try {
      const isExist = await this.gradeRepository.existsBy({
        name: createGradeDto.name,
      });

      if (isExist) {
        throw new Error(`${createGradeDto.name} grade already exists`);
      }

      const newGrade = this.gradeRepository.create(createGradeDto);
      return await this.gradeRepository.save(newGrade);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateGradeDto: UpdateGradeDto) {
    try {
      const isExist = await this.gradeRepository.existsBy({ id });
      if (!isExist) throw new Error(`Grade with id: ${id} doesn't exist`);
      return await this.gradeRepository.update(id, updateGradeDto);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.gradeRepository.existsBy({ id });
      if (!isExist) throw new Error(`Grade with id: ${id} doesn't exist`);
      return await this.gradeRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
