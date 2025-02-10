import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sigh-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    if (!user) {
      throw new ConflictException(
        `User with email: '${createUserDto.email}' already exist`,
      );
    }

    return user;
  }

  @Post('sign-in')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    const user = await this.authService.signIn(signInDto);
    if (!user) throw new BadRequestException('Wrong email or password');
    return user;
  }

  @Post('sign-out')
  async signOut(@Body(new ValidationPipe()) token: RefreshTokenDto) {
    await this.authService.signOut(token.refreshToken);
  }

  @Post('sign-out-everywhere')
  async signOutEverywhere(@Body(new ValidationPipe()) token: RefreshTokenDto) {
    await this.authService.signOutEverywhere(token.refreshToken);
  }

  @Post('refresh')
  async refreshToken(@Body(new ValidationPipe()) token: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(token.refreshToken);
    if (!tokens) throw new UnauthorizedException('Invalid token');
    return tokens;
  }
}
