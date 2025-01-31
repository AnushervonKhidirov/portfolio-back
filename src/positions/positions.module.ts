import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionEntity } from './entity/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
