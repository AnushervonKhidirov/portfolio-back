import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sigh-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      if (!user) {
        throw new Error(
          `User with email: '${createUserDto.email}' already exist`,
        );
      }

      return this.generateTokens(user.id, user.email);
    } catch (err) {
      console.log(err);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.findOneBy({
        email: signInDto.email,
      });

      if (!user) {
        throw new Error(`User with email: '${signInDto.email}' not found`);
      }

      const isCorrectPassword = await compare(
        signInDto.password,
        user.password,
      );

      if (!isCorrectPassword) {
        throw new Error('Wrong password');
      }

      return this.generateTokens(user.id, user.email);
    } catch (err) {
      console.log(err);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      return await this.tokenService.refresh(refreshToken);
    } catch (err) {
      console.log(err);
    }
  }

  private async generateTokens(userId: string, userEmail: string) {
    try {
      const tokens = this.tokenService.generate({ userId, userEmail });
      await this.tokenService.save(tokens.refreshToken);

      return tokens;
    } catch (err) {
      console.log(err);
    }
  }
}
