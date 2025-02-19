import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './jwt.service';
import { JwtEntity } from './entity/jwt.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([JwtEntity, UserEntity])],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
