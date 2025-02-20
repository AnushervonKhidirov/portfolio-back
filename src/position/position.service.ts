import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from './entity/position.entity';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  async findOne(
    where: FindOptionsWhere<PositionEntity>,
  ): TServiceAsyncMethodReturn<PositionEntity> {
    try {
      const position = await this.positionRepository.findOneBy(where);
      if (!position) return [null, new NotFoundException('Position not found')];
      return [position, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<PositionEntity>,
  ): TServiceAsyncMethodReturn<PositionEntity[]> {
    try {
      const positions = await this.positionRepository.find(options);

      if (!Array.isArray(positions)) {
        return [null, new InternalServerErrorException()];
      }

      return [positions, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    createPositionDto: CreatePositionDto,
  ): TServiceAsyncMethodReturn<PositionEntity> {
    try {
      const isExist = await this.positionRepository.existsBy({
        value: createPositionDto.value,
      });

      if (isExist) {
        return [
          null,
          new ConflictException(
            `Position '${createPositionDto.value}' already exist`,
          ),
        ];
      }

      const now = Date.now();

      const newPosition = this.positionRepository.create({
        ...createPositionDto,
        createdAt: now,
        updatedAt: now,
      });
      const createdPosition = await this.positionRepository.save(newPosition);
      if (!createdPosition) return [null, new InternalServerErrorException()];

      return [createdPosition, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): TServiceAsyncMethodReturn<PositionEntity> {
    try {
      const position = await this.positionRepository.findOneBy({ id });

      if (!position) {
        return [
          null,
          new NotFoundException(`Position with id '${id}' not found`),
        ];
      }

      const existedPosition = await this.positionRepository.findOneBy({
        value: updatePositionDto.value,
      });

      if (existedPosition) {
        return [
          null,
          new ConflictException(
            `Position '${updatePositionDto.value}' already exist by id '${existedPosition.id}'`,
          ),
        ];
      }

      const newPosition = this.positionRepository.create({
        ...position,
        ...updatePositionDto,
        updatedAt: Date.now(),
      });

      const updatedPosition = await this.positionRepository.save(newPosition);
      if (!updatedPosition) return [null, new InternalServerErrorException()];

      return [updatedPosition, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): TServiceAsyncMethodReturn<PositionEntity> {
    try {
      const position = await this.positionRepository.findOneBy({ id });

      if (!position) {
        return [
          null,
          new NotFoundException(`Position with id '${id}' not found`),
        ];
      }

      const result = await this.positionRepository.delete(id);
      if (!result) return [null, new InternalServerErrorException()];

      return [position, null];
    } catch (err) {
      console.log(err);
    }
  }
}
