import type { SignOptions } from 'jsonwebtoken';

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
  accessExp: SignOptions['expiresIn'];
  refreshExp: SignOptions['expiresIn'];

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.accessKey = process.env.TOKEN_ACCESS_KEY;
    this.refreshKey = process.env.TOKEN_REFRESH_KEY;
    this.accessExp = process.env.TOKEN_ACCESS_EXP as SignOptions['expiresIn'];
    this.refreshExp = process.env.TOKEN_REFRESH_EXP as SignOptions['expiresIn'];
  }

  generate(payload: TTokenPayload) {
    try {
      const accessToken = sign(payload, this.accessKey, {
        expiresIn: this.accessExp,
      });
      const refreshToken = sign(payload, this.refreshKey, {
        expiresIn: this.refreshExp,
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const { userId, userEmail } = decode(refreshToken) as TTokenPayload;
      const isValid = await this.validateRefreshToken(refreshToken);
      if (!isValid) throw new Error('Token is not valid');

      await this.delete(refreshToken)
      const tokens = await this.generateAndSave({ userId, userEmail });

      if (!tokens) throw new Error('Unable to generate tokens');
      return tokens;
    } catch (err) {
      console.log(err);
    }
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

  async generateAndSave(payload: TTokenPayload) {
    try {
      const tokens = this.generate(payload);
      await this.save(tokens.refreshToken);
      return tokens;
    } catch (err) {
      console.log(err);
    }
  }

  async delete(refreshToken: string) {
    try {
      const isValid = await this.validateRefreshToken(refreshToken);
      if (!isValid) throw new Error('Token is not valid');
      await this.tokenRepository.delete({ refreshToken });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll(refreshToken: string) {
    try {
      const { userId } = (await this.validateRefreshToken(
        refreshToken,
      )) as TTokenPayload;
      if (!userId) throw new Error('Token is not valid');
      await this.tokenRepository.delete({ userId });
    } catch (err) {
      console.log(err);
    }
  }

  validateAccessToken(accessToken: string) {
    try {
      return verify(accessToken, this.accessKey);
    } catch (err) {
      console.log(err);
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const isTokenExist = await this.tokenRepository.existsBy({
        refreshToken,
      });

      if (!isTokenExist) throw new Error("Token doesn't exist");
      return verify(refreshToken, this.refreshKey);
    } catch (err) {
      console.log(err);
    }
  }
}
