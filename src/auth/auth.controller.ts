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
import { SignOutDto } from './dto/sign-out.dto';

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
  async signOut(@Body(new ValidationPipe()) signOutDto: SignOutDto) {
    await this.authService.signOut(signOutDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out-everywhere')
  async signOutFromAllDevices(
    @Body(new ValidationPipe()) signOutDto: SignOutDto,
  ) {
    await this.authService.signOutFromAllDevices(signOutDto);
  }
}
