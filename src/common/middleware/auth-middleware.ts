import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { decode, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = this.jwtService.extractTokenFromHeader(req);
    if (!accessToken) throw new UnauthorizedException('Access token not found');

    const isValid = this.jwtService.verifyAccess(accessToken);
    if (!isValid) throw new UnauthorizedException('Token expired');

    const { sub, email } = decode(accessToken) as JwtPayload;
    req['user'] = { id: parseInt(sub), email };

    next();
  }
}
