import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify, decode } from 'jsonwebtoken';

import { TokenEntity } from './entity/token.entity';
import { UserEntity } from 'src/user/entity/user.entity';

export type TTokenPayload = {
  userId: string;
  userEmail: string;
};

@Injectable()
export class TokenService {
  accessKey: string;
  refreshKey: string;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.accessKey = process.env.TOKEN_ACCESS_KEY;
    this.refreshKey = process.env.TOKEN_REFRESH_KEY;
  }

  generate(payload: TTokenPayload) {
    const accessToken = sign(payload, this.accessKey, {
      expiresIn: '10s',
    });
    const refreshToken = sign(payload, this.refreshKey, {
      expiresIn: '1m',
    });

    return { accessToken, refreshToken };
  }

  async save(refreshToken: string) {
    try {
      const { userId } = decode(refreshToken) as TTokenPayload;
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new Error('User not found');

      const newRefreshToken = this.tokenRepository.create({
        refreshToken,
        user,
      });

      return await this.tokenRepository.save(newRefreshToken);
    } catch (err) {
      console.log(err);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const token = await this.tokenRepository.findOneBy({ refreshToken });
      if (
        !token.refreshToken ||
        !this.validateRefreshToken(token.refreshToken)
      ) {
        throw new Error('Invalid token');
      }

      const { userId, userEmail } = decode(token.refreshToken) as TTokenPayload;
      const newTokens = this.generate({ userId, userEmail });

      await this.save(newTokens.refreshToken);
      return newTokens;
    } catch (err) {
      console.log(err);
    }
  }

  private validateAccessToken(token: string) {
    try {
      return verify(token, this.accessKey);
    } catch (err) {
      console.log(err);
    }
  }

  private validateRefreshToken(token: string) {
    try {
      return verify(token, this.refreshKey);
    } catch (err) {
      console.log(err);
    }
  }
}
