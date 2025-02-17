import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(options: FindOptionsWhere<UserEntity>) {
    const { password, ...properOption } = options;

    try {
      const user = await this.userRepository.findOneBy(properOption);
      if (!user) throw new Error('User not found');
      return user;
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
      const newUser = this.userRepository.create({
        ...createUserDto,
        createdAt: Date.now(),
      });
      if (!newUser) throw new Error('Unable to create user');
      return await this.userRepository.save(newUser);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');
    return user;
  }

  async delete(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new Error('User not found');

      await this.userRepository.delete(id);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
