import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskEntity } from './entity/task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.taskRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.taskRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const isExist = await this.taskRepository.existsBy({
        name: createTaskDto.name,
      });

      if (isExist) throw new Error('Task already exist');

      const newTask = this.taskRepository.create(createTaskDto);
      return await this.taskRepository.save(newTask);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const isExist = await this.taskRepository.existsBy({ id });
      if (!isExist) throw new Error(`Task with id ${id} doesn't exist`);

      return await this.taskRepository.update(id, updateTaskDto);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.taskRepository.existsBy({ id });
      if (!isExist) throw new Error(`Task with id ${id} doesn't exist`);

      return await this.taskRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
