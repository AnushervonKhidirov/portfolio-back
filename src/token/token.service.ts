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

  constructor() {
    this.accessKey = process.env.TOKEN_ACCESS_KEY;
    this.refreshKey = process.env.TOKEN_REFRESH_KEY;
  }

  generate(payload: TTokenPayload) {
    try {
      const accessToken = sign(payload, this.accessKey, { expiresIn: '10s' });
      const refreshToken = sign(payload, this.refreshKey, { expiresIn: '1m' });

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
