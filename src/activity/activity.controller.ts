import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { ActivityService } from './activity.service';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async findAll() {
    const [activities, err] = await this.activityService.findAll();
    if (err) throw err;
    return activities;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [activity, err] = await this.activityService.findOne({ id });
    if (err) throw err;
    return activity;
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createActivityDto: CreateActivityDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id' | 'defaultProfileId'>;

    const [activity, err] = await this.activityService.create(
      user.defaultProfileId,
      createActivityDto,
    );

    if (err) throw err;

    return activity;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateActivityDto: UpdateActivityDto,
  ) {
    const [activity, err] = await this.activityService.update(
      id,
      updateActivityDto,
    );

    if (err) throw err;

    return activity;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [activity, err] = await this.activityService.delete(id);
    if (err) throw err;
    return activity;
  }
}
