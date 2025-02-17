import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compareSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from 'src/jwt/jwt.service';

import { UserDto } from 'src/user/dto/user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { decode, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: UserDto) {
    const isUserExist = await this.userService.findOne({
      email: userDto.email,
    });

    if (isUserExist) {
      throw new ConflictException(`User with ${userDto.email} already exist`);
    }

    const hashedPassword = await hash(userDto.password, 10);

    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestException(
        'Unable to add user, please try again later',
      );
    }

    const payload: JwtPayload = { sub: user.id.toString(), email: user.email };
    const token = this.jwtService.generate(payload);

    if (!token) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    const result = await this.jwtService.save(user, token.refreshToken);

    if (!result) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    return token;
  }

  async signIn(userDto: UserDto) {
    const user = await this.userService.findOne({
      email: userDto.email,
    });

    if (!user) throw new NotFoundException('User not found');

    const isCorrectPassword = compareSync(userDto.password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('Wrong password');

    const payload: JwtPayload = { sub: user.id.toString(), email: user.email };
    const token = this.jwtService.generate(payload);

    if (!token) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    const result = await this.jwtService.save(user, token.refreshToken);

    if (!result) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    return token;
  }

  async signOut({ refreshToken }: RefreshTokenDto) {
    const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
    if (!isValidToken) throw new UnauthorizedException();

    const result = await this.jwtService.delete(refreshToken);
    if (!result) throw new UnauthorizedException();
  }

  async signOutFromAllDevices({ refreshToken }: RefreshTokenDto) {
    const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
    if (!isValidToken) throw new UnauthorizedException();

    const result = await this.jwtService.deleteAll(refreshToken);
    if (!result) throw new UnauthorizedException();
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    const isValidToken = await this.jwtService.verifyRefresh(refreshToken);
    if (!isValidToken) throw new UnauthorizedException();

    const result = await this.jwtService.delete(refreshToken);
    if (!result) throw new UnauthorizedException();

    const { sub } = decode(refreshToken) as JwtPayload;
    const user = await this.userService.findOne({ id: parseInt(sub) });
    if (!user) throw new NotFoundException('User not found');

    const payload: JwtPayload = { sub: user.id.toString(), email: user.email };
    const token = this.jwtService.generate(payload);

    const savedToken = await this.jwtService.save(user, token.refreshToken);

    if (!savedToken) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    return token;
  }
}
