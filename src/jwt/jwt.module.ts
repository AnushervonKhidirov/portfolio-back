import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './jwt.service';
import { JwtEntity } from './entity/jwt.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([JwtEntity])],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
