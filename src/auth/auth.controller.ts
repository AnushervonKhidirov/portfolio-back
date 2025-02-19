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
    const [token, err] = await this.authService.signUp(userDto);
    if (err) throw err;
    return token;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body(new ValidationPipe()) userDto: UserDto) {
    const [token, err] = await this.authService.signIn(userDto);
    if (err) throw err;
    return token;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    const [_, err] = await this.authService.signOut(refreshTokenDto);
    if (err) throw err;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out-everywhere')
  async signOutFromAllDevices(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const [_, err] =
      await this.authService.signOutFromAllDevices(refreshTokenDto);
    if (err) throw err;
  }

  @Post('refresh')
  async refreshToken(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const [token, err] = await this.authService.refreshToken(refreshTokenDto);
    if (err) throw err;
    return token;
  }
}
