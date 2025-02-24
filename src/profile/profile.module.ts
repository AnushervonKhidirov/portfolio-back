import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from './entity/profile.entity';
import { ProfileHelper } from './profile.helper';

import { UserModule } from 'src/user/user.module';
import { PositionModule } from 'src/position/position.module';
import { GradeModule } from 'src/grade/grade.module';

@Module({
  imports: [
    UserModule,
    PositionModule,
    GradeModule,
    TypeOrmModule.forFeature([ProfileEntity]),
  ],
  providers: [ProfileService, ProfileHelper],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
