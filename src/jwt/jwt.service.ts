import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  LessThan,
} from 'typeorm';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { JwtEntity } from './entity/jwt.entity';
import { UserEntity } from 'src/user/entity/user.entity';

import { TimeConverter } from 'src/common/time-converter/time-converter';
import { Request } from 'express';

@Injectable()
export class JwtService {
  private readonly accessSecret: string = process.env.TOKEN_ACCESS_SECRET;
  private readonly refreshSecret: string = process.env.TOKEN_REFRESH_SECRET;

  constructor(
    @InjectRepository(JwtEntity)
    private readonly tokenRepository: Repository<JwtEntity>,
  ) {}

  generate(payload: JwtPayload) {
    try {
      const accessToken = sign(payload, this.accessSecret, {
        expiresIn: TimeConverter.getSecondsInMinutes(10),
      });
      const refreshToken = sign(payload, this.refreshSecret, {
        expiresIn: TimeConverter.getSecondsInDays(),
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
    }
  }

  verifyAccess(accessToken: string) {
    try {
      verify(accessToken, this.accessSecret, (err) => {
        if (err) throw new Error('Token is not valid');
      });

      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async verifyRefresh(refreshToken: string) {
    try {
      verify(refreshToken, this.refreshSecret, (err) => {
        if (err) throw new Error('Token is not valid');
      });

      const isTokenExist = await this.tokenRepository.existsBy({
        refreshToken,
      });

      return isTokenExist;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(option?: FindOptionsWhere<JwtEntity>) {
    try {
      const token = await this.tokenRepository.findOneBy(option);
      if (!token) throw new Error('Token not found');
      return token;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(option?: FindManyOptions<JwtEntity>) {
    try {
      const token = await this.tokenRepository.find(option);

      return token;
    } catch (err) {
      console.log(err);
    }
  }

  async save(user: UserEntity, refreshToken: string) {
    try {
      const tokenUserPair = this.tokenRepository.create({
        refreshToken,
        user,
        createdAt: Date.now(),
        expiredAt: Date.now() + TimeConverter.getMillisecondsInDays(),
      });

      return await this.tokenRepository.save(tokenUserPair);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(refreshToken: string) {
    try {
      const token = await this.findOne({ refreshToken });
      if (!token) throw new Error('Token not found');
      return this.tokenRepository.delete(refreshToken);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll(refreshToken: string) {
    try {
      const token = await this.findOne({ refreshToken });
      if (!token) throw new Error('Token not found');
      return this.tokenRepository.delete({ userId: token.userId });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteExpiredTokens() {
    const now = Date.now();

    try {
      const tokens = await this.findAll({
        where: { expiredAt: LessThan(now) },
      });

      return this.tokenRepository.remove(tokens);
    } catch (err) {
      console.log(err);
    }
  }

  extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
