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

import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementEntity } from './entity/achievement.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @ApiOkResponse({
    isArray: true,
    type: AchievementEntity,
    example: [
      {
        id: '017252e8-667b-461e-8f8e-6fe005fe8d46',
        value: 'Reading old code',
        createdAt: '2025-02-03T05:13:02.061Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.achievementsService.findAll();
  }

  @ApiOkResponse({
    type: AchievementEntity,
    example: {
      id: '017252e8-667b-461e-8f8e-6fe005fe8d46',
      value: 'Reading old code',
      createdAt: '2025-02-03T05:13:02.061Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const achievement = await this.achievementsService.findOne(id);
    if (!achievement) throw new NotFoundException();
    return achievement;
  }

  @ApiOkResponse({
    type: AchievementEntity,
    example: {
      id: '017252e8-667b-461e-8f8e-6fe005fe8d46',
      value: 'Reading old code',
      createdAt: '2025-02-03T05:13:02.061Z',
    },
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createAchievementDto: CreateAchievementDto,
  ) {
    const achievement =
      await this.achievementsService.create(createAchievementDto);
    if (!achievement) throw new ConflictException('Achievement already exists');
    return achievement;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateAchievementDto: UpdateAchievementDto,
  ) {
    const result = await this.achievementsService.update(
      id,
      updateAchievementDto,
    );
    if (!result) throw new NotFoundException();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.achievementsService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
