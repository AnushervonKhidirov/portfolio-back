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
    const { password, ...properOption } = options;
    const user = await this.userRepository.findOneBy(properOption);
    if (!user) return [null, new NotFoundException('User not found')];
    return [user, null];
  }

  async findAll(
    options?: FindManyOptions<UserEntity>,
  ): TServiceAsyncMethodReturn<UserEntity[]> {
    const users = await this.userRepository.find(options);

    if (!Array.isArray(users)) {
      return [null, new InternalServerErrorException()];
    }

    return [users, null];
  }

  async create(
    createUserDto: CreateUserDto,
  ): TServiceAsyncMethodReturn<UserEntity> {
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

    const now = Date.now();

    const newUser = this.userRepository.create({
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
    });

    const createUser = await this.userRepository.save(newUser);
    if (!createUser) return [null, new InternalServerErrorException()];

    return [createUser, null];
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): TServiceAsyncMethodReturn<UserEntity> {
    const [user, err] = await this.findOne({ id });
    if (err) return [null, err];

    const newUser = this.userRepository.create({
      ...user,
      ...updateUserDto,
      updatedAt: Date.now(),
    });

    const updatedUser = await this.userRepository.save(newUser);
    if (!updatedUser) return [null, new InternalServerErrorException()];

    return [updatedUser, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<UserEntity> {
    const [user, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.userRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [user, null];
  }
}
