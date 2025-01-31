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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    return await this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const skill = await this.positionsService.findOne(id);
    if (!skill) throw new NotFoundException();
    return skill;
  }

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
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.positionsService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
