import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeEntity } from './entity/grade.entity';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
  ) {}

  async findOne(
    where: FindOptionsWhere<GradeEntity>,
  ): TServiceAsyncMethodReturn<GradeEntity> {
    const grade = await this.gradeRepository.findOneBy(where);
    if (!grade) return [null, new NotFoundException('Grade not found')];
    return [grade, null];
  }

  async findAll(
    options?: FindManyOptions<GradeEntity>,
  ): TServiceAsyncMethodReturn<GradeEntity[]> {
    const grades = await this.gradeRepository.find(options);

    if (!Array.isArray(grades)) {
      return [null, new InternalServerErrorException()];
    }

    return [grades, null];
  }

  async create(
    createGradeDto: CreateGradeDto,
  ): TServiceAsyncMethodReturn<GradeEntity> {
    const isExist = await this.gradeRepository.existsBy({
      value: createGradeDto.value,
    });

    if (isExist) {
      return [
        null,
        new ConflictException(`Grade '${createGradeDto.value}' already exist`),
      ];
    }

    const now = Date.now();

    const newGrade = this.gradeRepository.create({
      ...createGradeDto,
      createdAt: now,
      updatedAt: now,
    });

    const createdGrade = await this.gradeRepository.save(newGrade);
    if (!createdGrade) return [null, new InternalServerErrorException()];

    return [createdGrade, null];
  }

  async update(
    id: number,
    updateGradeDto: UpdateGradeDto,
  ): TServiceAsyncMethodReturn<GradeEntity> {
    const [grade, err] = await this.findOne({ id });
    if (!grade) return [null, err];

    const [existedGrade] = await this.findOne({
      value: updateGradeDto.value,
    });

    if (existedGrade) {
      return [
        null,
        new ConflictException(
          `Grade '${updateGradeDto.value}' already exist by id '${existedGrade.id}'`,
        ),
      ];
    }

    const newGrade = this.gradeRepository.create({
      ...grade,
      ...updateGradeDto,
      updatedAt: Date.now(),
    });

    const updatedGrade = await this.gradeRepository.save(newGrade);
    if (!updatedGrade) return [null, new InternalServerErrorException()];

    return [updatedGrade, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<GradeEntity> {
    const [grade, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.gradeRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [grade, null];
  }
}
