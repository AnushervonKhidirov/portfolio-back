import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { hash, compareSync } from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { JwtService } from 'src/jwt/jwt.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { JwtEntity } from 'src/jwt/entity/jwt.entity';
import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';
import { TToken } from '@common/type/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): TServiceAsyncMethodReturn<TToken> {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const [user, userRrr] = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      if (userRrr) return [null, userRrr];

      const payload: JwtPayload = {
        sub: user.id.toString(),
        email: user.email,
      };
      const token = this.jwtService.generate(payload);

      if (!token) {
        return [null, new InternalServerErrorException()];
      }

      const [_, tokenErr] = await this.jwtService.create(
        user,
        token.refreshToken,
      );

      if (tokenErr) return [null, tokenErr];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async signIn(signInDto: SignInDto): TServiceAsyncMethodReturn<TToken> {
    try {
      const [user, userRrr] = await this.userService.findOne({
        email: signInDto.email,
      });

      if (userRrr) return [null, userRrr];

      const isCorrectPassword = compareSync(signInDto.password, user.password);
      if (!isCorrectPassword)
        return [null, new UnauthorizedException('Wrong password')];

      const payload: JwtPayload = {
        sub: user.id.toString(),
        email: user.email,
      };
      const token = this.jwtService.generate(payload);

      if (!token) {
        return [null, new InternalServerErrorException()];
      }

      const [_, tokenErr] = await this.jwtService.create(
        user,
        token.refreshToken,
      );

      if (tokenErr) return [null, tokenErr];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async signOut({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
      if (!isValidToken) return [null, new UnauthorizedException()];

      const [token, err] = await this.jwtService.delete(refreshToken);
      if (err) return [null, new UnauthorizedException()];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async signOutFromAllDevices({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<JwtEntity> {
    try {
      const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
      if (!isValidToken) return [null, new UnauthorizedException()];

      const [token, err] = await this.jwtService.deleteAll(refreshToken);
      if (err) return [null, new UnauthorizedException()];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<TToken> {
    try {
      const [token, err] = await this.jwtService.refresh(refreshToken);
      if (err) return [null, err];
      return [token, null];
    } catch (err) {
      console.log(err);
    }
  }
}
