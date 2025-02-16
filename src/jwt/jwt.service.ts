import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtEntity } from './entity/jwt.entity';
import { UserEntity } from 'src/user/entity/user.entity';

import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  accessSecret: string = process.env.TOKEN_ACCESS_SECRET;
  refreshSecret: string = process.env.TOKEN_REFRESH_SECRET;

  constructor(
    @InjectRepository(JwtEntity)
    private readonly tokenRepository: Repository<JwtEntity>,
  ) {}

  generate(payload: string | object | Buffer) {
    try {
      const accessToken = sign(payload, this.accessSecret, {
        expiresIn: '10m',
      });
      const refreshToken = sign(payload, this.refreshSecret, {
        expiresIn: '1d',
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
    }
  }

  async save(user: UserEntity, refreshToken: string) {
    try {
      const tokenUserPair = this.tokenRepository.create({
        refreshToken,
        user,
      });

      return await this.tokenRepository.insert(tokenUserPair);
    } catch (err) {
      console.log(err);
    }
  }
}
