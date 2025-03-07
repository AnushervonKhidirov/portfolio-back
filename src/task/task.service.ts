import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';

import { TaskEntity } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async findOne(
    where: FindOptionsWhere<TaskEntity>,
  ): TServiceAsyncMethodReturn<TaskEntity> {
    const task = await this.taskRepository.findOneBy(where);
    if (!task) return [null, new NotFoundException('Task not found')];
    return [task, null];
  }

  async findAll(
    options?: FindManyOptions<TaskEntity>,
  ): TServiceAsyncMethodReturn<TaskEntity[]> {
    const tasks = await this.taskRepository.find(options);

    if (!Array.isArray(tasks)) {
      return [null, new InternalServerErrorException()];
    }

    return [tasks, null];
  }

  async create(
    createTaskDto: CreateTaskDto,
  ): TServiceAsyncMethodReturn<TaskEntity> {
    const now = Date.now();

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      createdAt: now,
      updatedAt: now,
    });

    const task = await this.taskRepository.save(newTask);

    if (!task) {
      return [null, new InternalServerErrorException('Unable to create task')];
    }

    return [task, null];
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): TServiceAsyncMethodReturn<TaskEntity> {
    const isExist = await this.taskRepository.existsBy({ id });
    if (!isExist) return [null, new NotFoundException('Task not found')];

    const updatedTask = this.taskRepository.create({
      ...updateTaskDto,
      updatedAt: Date.now(),
    });

    const task = await this.taskRepository.save(updatedTask);

    if (!task) {
      return [null, new InternalServerErrorException('Unable to update task')];
    }

    return [task, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<TaskEntity> {
    const [task, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      return [null, new InternalServerErrorException('Unable to delete task')];
    }

    return [task, null];
  }
}
