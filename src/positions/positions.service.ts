import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PositionEntity } from './entity/position.entity';

import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.positionRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.positionRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createPositionDto: CreatePositionDto) {
    try {
      const isExist = await this.positionRepository.existsBy({
        name: createPositionDto.name,
      });
      if (isExist) throw new Error(`${createPositionDto.name} already exists`);

      const newPosition = this.positionRepository.create(createPositionDto);
      return await this.positionRepository.save(newPosition);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updatePositionDto: UpdatePositionDto) {
    try {
      const position = await this.positionRepository.findOneBy({ id });
      if (!position) throw new Error(`Position with id: ${id} doesn't exists`);

      const updatedPosition = this.positionRepository.create({
        ...position,
        ...updatePositionDto,
      });

      return await this.positionRepository.save(updatedPosition);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.positionRepository.existsBy({ id });
      if (!isExist) throw new Error(`Position with id: ${id} doesn't exists`);

      return await this.positionRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
