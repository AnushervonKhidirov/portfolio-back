import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  ValidationPipe,
  ConflictException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { TasksService } from './tasks.service';

import { TaskEntity } from './entity/task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOkResponse({
    isArray: true,
    type: TaskEntity,
    example: [
      {
        id: 'a5acdd8b-f7b4-40af-9070-37aa8057d6f8',
        value: 'Refactoring code',
        createdAt: '2025-02-03T04:34:54.152Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @ApiOkResponse({
    type: TaskEntity,
    example: {
      id: 'a5acdd8b-f7b4-40af-9070-37aa8057d6f8',
      value: 'Refactoring code',
      createdAt: '2025-02-03T04:34:54.152Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new NotFoundException();
    return task;
  }

  @ApiOkResponse({
    type: TaskEntity,
    example: {
      id: 'a5acdd8b-f7b4-40af-9070-37aa8057d6f8',
      value: 'Refactoring code',
      createdAt: '2025-02-03T04:34:54.152Z',
    },
  })
  @Post()
  async create(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    if (!task) throw new ConflictException('Task already exists');
    return task;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ) {
    const result = await this.tasksService.update(id, updateTaskDto);
    if (!result) throw new NotFoundException();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.tasksService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
