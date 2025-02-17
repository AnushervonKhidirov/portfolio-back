import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) userDto: UserDto) {
    return await this.authService.signUp(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body(new ValidationPipe()) userDto: UserDto) {
    return await this.authService.signIn(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    await this.authService.signOut(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out-everywhere')
  async signOutFromAllDevices(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    await this.authService.signOutFromAllDevices(refreshTokenDto);
  }

  @Post('refresh')
  async refreshToken(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
