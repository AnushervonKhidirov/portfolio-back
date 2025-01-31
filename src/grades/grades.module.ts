import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { GradeEntity } from './entity/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GradeEntity])],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
