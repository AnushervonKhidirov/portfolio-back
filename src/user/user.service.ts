import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(
    options: FindOptionsWhere<UserEntity>,
  ): TServiceAsyncMethodReturn<UserEntity> {
    try {
      const { password, ...properOption } = options;
      const user = await this.userRepository.findOneBy(properOption);
      if (!user) return [null, new NotFoundException('User not found')];
      return [user, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<UserEntity>,
  ): TServiceAsyncMethodReturn<UserEntity[]> {
    try {
      const users = await this.userRepository.find(options);

      if (!Array.isArray(users)) {
        return [null, new InternalServerErrorException()];
      }

      return [users, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(createUserDto: CreateUserDto): TServiceAsyncMethodReturn<UserEntity> {
    try {
      const isExit = await this.userRepository.existsBy({
        email: createUserDto.email,
      });

      if (isExit) {
        return [
          null,
          new ConflictException(
            `User with email '${createUserDto.email}' already exist`,
          ),
        ];
      }

      const newUser = this.userRepository.create({
        ...createUserDto,
        createdAt: Date.now(),
      });
      const createUser = await this.userRepository.save(newUser);

      return [createUser, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): TServiceAsyncMethodReturn<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return [null, new NotFoundException('User not found')];

    const newUser = this.userRepository.create({
      ...user,
      ...updateUserDto,
    });

    const updatedUser = await this.userRepository.save(newUser);
    return [updatedUser, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return [null, new NotFoundException('User not found')];

      await this.userRepository.delete(id);
      return [user, null];
    } catch (err) {
      console.log(err);
    }
  }
}
