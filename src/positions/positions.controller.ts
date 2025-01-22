import { Controller, Get, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    return await this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.positionsService.findOne(id);
  }
}
