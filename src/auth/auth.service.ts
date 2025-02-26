import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    const [token, generateErr] = this.jwtService.generate(payload);
    if (generateErr) return [null, generateErr];

    const [_, tokenErr] = await this.jwtService.create(
      user,
      token.refreshToken,
    );

    if (tokenErr) return [null, tokenErr];

    return [token, null];
  }

  async signIn(signInDto: SignInDto): TServiceAsyncMethodReturn<TToken> {
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

    const [token, generateErr] = this.jwtService.generate(payload);
    if (generateErr) return [null, generateErr];

    const [_, tokenErr] = await this.jwtService.create(
      user,
      token.refreshToken,
    );

    if (tokenErr) return [null, tokenErr];
    return [token, null];
  }

  async signOut({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<JwtEntity> {
    const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
    if (!isValidToken) return [null, new UnauthorizedException()];

    const [token, err] = await this.jwtService.delete(refreshToken);
    if (err) return [null, new UnauthorizedException()];
    return [token, null];
  }

  async signOutFromAllDevices({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<JwtEntity> {
    const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
    if (!isValidToken) return [null, new UnauthorizedException()];

    const [token, err] = await this.jwtService.deleteAll(refreshToken);
    if (err) return [null, new UnauthorizedException()];
    return [token, null];
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): TServiceAsyncMethodReturn<TToken> {
    const [token, err] = await this.jwtService.refresh(refreshToken);
    if (err) return [null, err];
    return [token, null];
  }
}
