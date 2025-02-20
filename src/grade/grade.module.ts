import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { GradeEntity } from './entity/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity])],
  providers: [GradeService],
  controllers: [GradeController],
})
export class GradeModule {}
