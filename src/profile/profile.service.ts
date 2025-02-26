import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { UserService } from 'src/user/user.service';
import { ProfileHelper } from './profile.helper';
import { ProfileEntity } from './entity/profile.entity';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    private readonly profileHelper: ProfileHelper,
    private readonly userService: UserService,
  ) {}

  async findOne(
    where: FindOptionsWhere<ProfileEntity>,
  ): TServiceAsyncMethodReturn<ProfileEntity> {
    const profile = await this.profileRepository.findOneBy(where);
    if (!profile) return [null, new NotFoundException('Profile not found')];
    return [profile, null];
  }

  async findAll(
    options?: FindManyOptions<ProfileEntity>,
  ): TServiceAsyncMethodReturn<ProfileEntity[]> {
    const profiles = await this.profileRepository.find(options);

    if (!Array.isArray(profiles)) {
      return [null, new InternalServerErrorException()];
    }

    return [profiles, null];
  }

  async create(
    createProfileDto: CreateProfileDto,
    userRelationId: number,
  ): TServiceAsyncMethodReturn<ProfileEntity> {
    const [userRelation, userErr] = await this.userService.findOne({
      id: userRelationId,
    });

    if (userErr) return [null, userErr];

    const [position, positionErr] = await this.profileHelper.getPosition(
      createProfileDto.positionId,
    );

    if (positionErr) return [null, positionErr];

    const [grade, gradeErr] = await this.profileHelper.getGrade(
      createProfileDto.gradeId,
    );

    if (gradeErr) return [null, gradeErr];

    const now = Date.now();

    const newProfile = this.profileRepository.create({
      ...createProfileDto,
      createdAt: now,
      updatedAt: now,
      user: userRelation,
      position,
      grade,
    });

    const createdProfile = await this.profileRepository.save(newProfile);
    if (!createdProfile) return [null, new InternalServerErrorException()];

    const [_, updateUserErr] = await this.userService.update(userRelation.id, {
      defaultProfile: createdProfile,
    });
    if (updateUserErr) return [null, updateUserErr];

    return [createdProfile, null];
  }

  async switch(
    id: number,
    userRelationId: number,
  ): TServiceAsyncMethodReturn<ProfileEntity> {
    const [profile, profileErr] = await this.findOne({ id });
    if (profileErr) return [null, profileErr];

    const [userRelation, userErr] = await this.userService.findOne({
      id: userRelationId,
    });
    if (userErr) return [null, userErr];

    const [_, updateUserErr] = await this.userService.update(userRelation.id, {
      defaultProfile: profile,
    });
    if (updateUserErr) return [null, updateUserErr];

    return [profile, null];
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): TServiceAsyncMethodReturn<ProfileEntity> {
    const [profile, err] = await this.findOne({ id });
    if (err) return [null, err];

    const [position, positionErr] = await this.profileHelper.getPosition(
      updateProfileDto.positionId,
      profile,
    );

    if (positionErr) return [null, positionErr];

    const [grade, gradeErr] = await this.profileHelper.getGrade(
      updateProfileDto.gradeId,
      profile,
    );

    if (gradeErr) return [null, gradeErr];

    const newProfile = this.profileRepository.create({
      ...profile,
      ...updateProfileDto,
      position,
      grade,
      updatedAt: Date.now(),
    });

    const updatedProfile = await this.profileRepository.save(newProfile);
    if (!updatedProfile) return [null, new InternalServerErrorException()];

    return [updatedProfile, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<ProfileEntity> {
    const [profile, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.profileRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [profile, null];
  }
}
