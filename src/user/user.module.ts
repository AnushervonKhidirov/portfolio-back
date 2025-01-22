import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { PositionsModule } from 'src/positions/positions.module';
import { GradesModule } from 'src/grades/grades.module';

@Module({
  imports: [PositionsModule, GradesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
