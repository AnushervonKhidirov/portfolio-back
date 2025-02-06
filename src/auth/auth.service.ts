import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sigh-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userRepository.findOneBy({
        email: signInDto.email,
      });

      if (!user) {
        throw new Error(`User with email: '${signInDto.email}' doesn't exist`);
      }

      const isCorrectPassword = await compare(
        signInDto.password,
        user.password,
      );

      if (!isCorrectPassword) throw new Error('Wrong password');

      const {password, ...userWithoutPassword} = user

      return userWithoutPassword;
    } catch (err) {
      console.log(err);
    }
  }
}
