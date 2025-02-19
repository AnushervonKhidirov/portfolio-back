import {
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
import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';
import { TToken } from '@common/type/token.type';

@Injectable()
export class JwtService {
  private readonly accessSecret: string = process.env.TOKEN_ACCESS_SECRET;
  private readonly refreshSecret: string = process.env.TOKEN_REFRESH_SECRET;

  constructor(
    @InjectRepository(JwtEntity)
    private readonly tokenRepository: Repository<JwtEntity>,

    private readonly userService: UserService,
  ) {}

  generate(payload: JwtPayload): TToken {
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

  async findOne(
    option?: FindOptionsWhere<JwtEntity>,
  ): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const token = await this.tokenRepository.findOneBy(option);
      if (!token) return [null, new NotFoundException('Token not found')];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    option?: FindManyOptions<JwtEntity>,
  ): TServiceAsyncMethodReturn<JwtEntity[]> {
    try {
      const token = await this.tokenRepository.find(option);
      if (!Array.isArray(token)) {
        return [null, new InternalServerErrorException()];
      }

      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    user: UserEntity,
    refreshToken: string,
  ): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const tokenUserPair = this.tokenRepository.create({
        refreshToken,
        user,
        createdAt: Date.now(),
        expiredAt: Date.now() + TimeConverter.getMillisecondsInDays(),
      });

      const token = await this.tokenRepository.save(tokenUserPair);
      if (!token) return [null, new InternalServerErrorException()];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async refresh(refreshToken: string): TServiceAsyncMethodReturn<TToken> {
    try {
      const isValidToken = await this.verifyRefresh(refreshToken);
      if (!isValidToken) return [null, new UnauthorizedException()];

      const result = await this.tokenRepository.delete(refreshToken);
      if (!result) return [null, new UnauthorizedException()];

      const { sub } = decode(refreshToken) as JwtPayload;
      const [user, err] = await this.userService.findOne({ id: parseInt(sub) });
      if (err) return [null, err];

      const payload: JwtPayload = {
        sub: user.id.toString(),
        email: user.email,
      };
      const token = this.generate(payload);
      const [_, saveErr] = await this.create(user, token.refreshToken);
      if (saveErr) return [null, saveErr];

      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(refreshToken: string): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const token = await this.tokenRepository.findOneBy({ refreshToken });
      if (!token) return [null, new NotFoundException('Token not found')];
      await this.tokenRepository.delete(refreshToken);
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll(refreshToken: string): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const token = await this.tokenRepository.findOneBy({ refreshToken });
      if (!token) return [null, new NotFoundException('Token not found')];
      await this.tokenRepository.delete({ userId: token.userId });
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async deleteExpiredTokens() {
    const now = Date.now();

    try {
      const tokens = await this.tokenRepository.find({
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
