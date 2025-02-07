import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokenEntity } from './entity/token.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity, UserEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
