import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sigh-in.dto';

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
    if (!user) throw new NotFoundException();
    return user;
  }
}
