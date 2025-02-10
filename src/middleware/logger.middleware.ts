import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TokenService } from 'src/token/token.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  // TODO: get token from headers!!!!
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.body.accessToken;

    if (!accessToken) throw new UnauthorizedException();

    const isValid = this.tokenService.validateAccessToken(accessToken);
    if (!isValid) throw new UnauthorizedException();

    next();
  }
}
