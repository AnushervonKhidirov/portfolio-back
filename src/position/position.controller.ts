import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from './entity/position.entity';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @ApiOkResponse({ type: PositionEntity, isArray: true })
  @Get()
  async findAll() {
    const [positions, err] = await this.positionService.findAll();
    if (err) throw err;
    return positions;
  }

  @ApiOkResponse({ type: PositionEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [position, err] = await this.positionService.findOne({ id });
    if (err) throw err;
    return position;
  }

  @ApiOkResponse({ type: PositionEntity })
  @Post()
  async create(
    @Body(new ValidationPipe()) createPositionDto: CreatePositionDto,
  ) {
    const [position, err] =
      await this.positionService.create(createPositionDto);
    if (err) throw err;
    return position;
  }

  @ApiOkResponse({ type: PositionEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updatePositionDto: UpdatePositionDto,
  ) {
    const [position, err] = await this.positionService.update(
      id,
      updatePositionDto,
    );
    if (err) throw err;
    return position;
  }

  @ApiOkResponse({ type: PositionEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [position, err] = await this.positionService.delete(id);
    if (err) throw err;
    return position;
  }
}
