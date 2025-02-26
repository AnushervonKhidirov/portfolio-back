import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  LessThan,
} from 'typeorm';
import { sign, verify, JwtPayload, decode } from 'jsonwebtoken';
import { JwtEntity } from './entity/jwt.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

import { TimeConverter } from '@common/time-converter/time-converter';
import {
  TServiceAsyncMethodReturn,
  TServiceMethodReturn,
} from '@common/type/service-method.type';
import { TToken } from '@common/type/token.type';

@Injectable()
export class JwtService {
  private readonly accessSecret: string = process.env.TOKEN_ACCESS_SECRET!;
  private readonly refreshSecret: string = process.env.TOKEN_REFRESH_SECRET!;

  constructor(
    @InjectRepository(JwtEntity)
    private readonly tokenRepository: Repository<JwtEntity>,

    private readonly userService: UserService,
  ) {}

  generate(payload: JwtPayload): TServiceMethodReturn<TToken> {
    const accessToken = sign(payload, this.accessSecret, {
      expiresIn: TimeConverter.getSecondsInMinutes(10),
    });
    const refreshToken = sign(payload, this.refreshSecret, {
      expiresIn: TimeConverter.getSecondsInDays(),
    });

    if (!accessToken || !refreshToken) {
      return [null, new InternalServerErrorException()];
    }

    return [{ accessToken, refreshToken }, null];
  }

  verifyAccess(accessToken: string) {
    let isValid = true;
    verify(accessToken, this.accessSecret, (err) => {
      if (err) isValid = false;
    });

    return isValid;
  }

  async verifyRefresh(refreshToken: string) {
    let isValid = true;
    verify(refreshToken, this.refreshSecret, (err) => {
      if (err) isValid = false;
    });

    const isTokenExist = await this.tokenRepository.existsBy({
      refreshToken,
    });

    return isTokenExist && isValid;
  }

  async findOne(
    where: FindOptionsWhere<JwtEntity>,
  ): TServiceAsyncMethodReturn<JwtEntity> {
    const token = await this.tokenRepository.findOneBy(where);
    if (!token) return [null, new NotFoundException('Token not found')];
    return [token, null];
  }

  async findAll(
    option?: FindManyOptions<JwtEntity>,
  ): TServiceAsyncMethodReturn<JwtEntity[]> {
    const token = await this.tokenRepository.find(option);

    if (!Array.isArray(token)) {
      return [null, new InternalServerErrorException()];
    }

    return [token, null];
  }

  async create(
    user: UserEntity,
    refreshToken: string,
  ): TServiceAsyncMethodReturn<JwtEntity> {
    const tokenUserPair = this.tokenRepository.create({
      refreshToken,
      user,
      createdAt: Date.now(),
      expiredAt: Date.now() + TimeConverter.getMillisecondsInDays(),
    });

    const token = await this.tokenRepository.save(tokenUserPair);
    if (!token) return [null, new InternalServerErrorException()];
    return [token, null];
  }

  async refresh(refreshToken: string): TServiceAsyncMethodReturn<TToken> {
    const isValidToken = await this.verifyRefresh(refreshToken);
    if (!isValidToken) return [null, new UnauthorizedException()];

    const result = await this.tokenRepository.delete(refreshToken);
    if (!result.affected) return [null, new InternalServerErrorException()];

    const { sub } = decode(refreshToken) as JwtPayload;
    if (!sub) return [null, new BadRequestException()];

    const [user, err] = await this.userService.findOne({ id: parseInt(sub) });
    if (err) return [null, err];

    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
    };
    const [token, generateErr] = this.generate(payload);
    if (generateErr) return [null, generateErr];

    const [_, saveErr] = await this.create(user, token.refreshToken);
    if (saveErr) return [null, saveErr];

    return [token, null];
  }

  async delete(refreshToken: string): TServiceAsyncMethodReturn<JwtEntity> {
    const [token, err] = await this.findOne({ refreshToken });
    if (err) return [null, err];

    const result = await this.tokenRepository.delete(refreshToken);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [token, null];
  }

  async deleteAll(refreshToken: string): TServiceAsyncMethodReturn<JwtEntity> {
    const [token, err] = await this.findOne({ refreshToken });
    if (err) return [null, err];

    const result = await this.tokenRepository.delete({ userId: token.userId });
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [token, null];
  }

  async deleteExpiredTokens(): TServiceAsyncMethodReturn<JwtEntity[]> {
    const now = Date.now();

    const [tokens, err] = await this.findAll({
      where: { expiredAt: LessThan(now) },
    });

    if (err) return [null, err];

    const expiredTokens = await this.tokenRepository.remove(tokens);

    if (!Array.isArray(expiredTokens)) {
      return [
        null,
        new InternalServerErrorException('Unable to remove expired tokens'),
      ];
    }

    return [expiredTokens, null];
  }

  extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
