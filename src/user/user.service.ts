import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { UserEntity } from './entity/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: string) {
    try {
      const { password, ...user } = await this.userRepository.findOneBy({ id });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return usersWithoutPassword;
    } catch (err) {
      console.log(err);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const isExist = await this.userRepository.existsBy({
        email: createUserDto.email,
      });

      if (isExist) {
        throw new Error(
          `User with email: '${createUserDto.email}' already exist`,
        );
      }

      const hashedPassword = await hash(createUserDto.password, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const { password, ...user } = await this.userRepository.save(newUser);
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const isExist = await this.userRepository.existsBy({ id });
      if (!isExist) throw new Error(`User with id '${id}' doesn't exist`);
      return await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.userRepository.existsBy({ id });
      if (!isExist) throw new Error(`User with id '${id}' doesn't exist`);
      return await this.userRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
