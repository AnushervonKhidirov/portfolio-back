import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { JwtEntity } from 'src/jwt/entity/jwt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, JwtEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
