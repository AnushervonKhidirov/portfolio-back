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

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.generate(payload);

    if (!token) {
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

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.generate(payload);

    if (!token) {
      throw new BadRequestException(
        'Unable to create token, please try again later',
      );
    }

    return token;
  }

  async signOut() {}
}
