import { Controller, Get, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async getPositions() {
    return await this.positionsService.getPositions();
  }

  @Get(':id')
  async getPosition(@Param('id') id: string) {
    return await this.positionsService.getPosition(id);
  }
}
