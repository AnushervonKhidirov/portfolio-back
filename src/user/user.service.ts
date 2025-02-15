import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(options?: FindManyOptions<UserEntity>) {
    try {
      return await this.userRepository.find(options);
    } catch (err) {
      console.log(err);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    return user;
  }

  async delete(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return null;

      await this.userRepository.delete(id);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
