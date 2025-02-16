import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  accessSecret: string = process.env.TOKEN_ACCESS_SECRET;
  refreshSecret: string = process.env.TOKEN_REFRESH_SECRET;

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
}
