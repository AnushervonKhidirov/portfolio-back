import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { TokenService } from './token.service';
import { TokenEntity } from './entity/token.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TokenEntity, UserEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
