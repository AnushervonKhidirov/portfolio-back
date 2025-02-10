import type { SignOptions } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { sign, verify, decode } from 'jsonwebtoken';

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

  constructor() {
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

  refresh(refreshToken: string) {
    try {
      const { userId, userEmail } = decode(refreshToken) as TTokenPayload;
      const isValid = this.validateRefreshToken(refreshToken);
      if (isValid) return this.generate({ userId, userEmail });
    } catch (err) {
      console.log(err);
    }
  }

  validateAccessToken(token: string) {
    try {
      return verify(token, this.accessKey);
    } catch (err) {
      console.log(err);
    }
  }

  validateRefreshToken(token: string) {
    try {
      return verify(token, this.refreshKey);
    } catch (err) {
      console.log(err);
    }
  }
}
