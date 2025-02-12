import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ValidationPipe,
  ConflictException,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from './entity/position.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @ApiOkResponse({
    type: PositionEntity,
    isArray: true,
    example: [
      {
        id: '2da87a04-fee4-49e0-939b-1b3ac750406f',
        name: 'Back-End',
        createdAt: '2025-01-31T14:23:56.658Z',
      },
    ],
  })
  @Get()
  async findAll() {
    return await this.positionsService.findAll();
  }

  @ApiOkResponse({
    type: PositionEntity,
    example: {
      id: '2da87a04-fee4-49e0-939b-1b3ac750406f',
      name: 'Back-End',
      createdAt: '2025-01-31T14:23:56.658Z',
    },
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const skill = await this.positionsService.findOne(id);
    if (!skill) throw new NotFoundException();
    return skill;
  }

  @ApiOkResponse({
    type: PositionEntity,
    example: {
      id: '2da87a04-fee4-49e0-939b-1b3ac750406f',
      name: 'Back-End',
      createdAt: '2025-01-31T14:23:56.658Z',
    },
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createPositionDto: CreatePositionDto,
  ) {
    const position = await this.positionsService.create(createPositionDto);
    if (!position) {
      throw new ConflictException(
        `Position '${createPositionDto.name}' already exist`,
      );
    }

    return position;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updatePositionDto: UpdatePositionDto,
  ) {
    const position = await this.positionsService.update(id, updatePositionDto);
    if (!position) throw new NotFoundException();
    return position;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.positionsService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
