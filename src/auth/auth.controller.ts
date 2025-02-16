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

  async signOut() {}
}
