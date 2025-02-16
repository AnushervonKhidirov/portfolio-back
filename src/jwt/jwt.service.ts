import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { JwtEntity } from './entity/jwt.entity';
import { UserEntity } from 'src/user/entity/user.entity';

import { sign, verify } from 'jsonwebtoken';
import { SignOutDto } from 'src/auth/dto/sign-out.dto';

@Injectable()
export class JwtService {
  private readonly accessSecret: string = process.env.TOKEN_ACCESS_SECRET;
  private readonly refreshSecret: string = process.env.TOKEN_REFRESH_SECRET;

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

  verifyRefresh(refreshToken: string) {
    try {
      verify(refreshToken, this.refreshSecret, (err) => {
        if (err) throw new Error('Token is not valid');
      });

      return true;
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
      });

      return await this.tokenRepository.save(tokenUserPair);
    } catch (err) {
      console.log(err);
    }
  }

  async delete({ refreshToken }: SignOutDto) {
    try {
      const token = await this.findOne({ refreshToken });
      if (!token) throw new Error('Token not found');
      return this.tokenRepository.delete(refreshToken);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll({ refreshToken }: SignOutDto) {
    try {
      const token = await this.findOne({ refreshToken });
      if (!token) throw new Error('Token not found');
      return this.tokenRepository.delete({ userId: token.userId });
    } catch (err) {
      console.log(err);
    }
  }
}
