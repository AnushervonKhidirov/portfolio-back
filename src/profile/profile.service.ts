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

export type TProfileResponse = Omit<
  ProfileEntity,
  'user' | 'positionId' | 'gradeId'
>;

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
  ): TServiceAsyncMethodReturn<TProfileResponse> {
    try {
      const profile = await this.profileRepository.findOneBy(where);
      if (!profile) return [null, new NotFoundException('Profile not found')];

      const { user, positionId, gradeId, ...profileResponse } = profile;
      return [profileResponse, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<ProfileEntity>,
  ): TServiceAsyncMethodReturn<TProfileResponse[]> {
    try {
      const profiles = await this.profileRepository.find(options);
      if (!Array.isArray(profiles)) {
        return [null, new InternalServerErrorException()];
      }

      const profilesResponse = profiles.map((profile) => {
        const { user, positionId, gradeId, ...profileResponse } = profile;
        return profileResponse;
      });

      return [profilesResponse, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    createProfileDto: CreateProfileDto,
    userRelationId: number,
  ): TServiceAsyncMethodReturn<TProfileResponse> {
    try {
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

      const { user, positionId, gradeId, ...profileResponse } = createdProfile;
      return [profileResponse, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): TServiceAsyncMethodReturn<TProfileResponse> {
    try {
      const profile = await this.profileRepository.findOneBy({ id });
      if (!profile) return [null, new NotFoundException('Profile not found')];

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

      const { user, positionId, gradeId, ...profileResponse } = updatedProfile;
      return [profileResponse, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): TServiceAsyncMethodReturn<TProfileResponse> {
    try {
      const profile = await this.profileRepository.findOneBy({ id });
      if (!profile) return [null, new NotFoundException('Profile not found')];

      const result = await this.profileRepository.delete(id);
      if (!result) return [null, new InternalServerErrorException()];

      const { user, positionId, gradeId, ...profileResponse } = profile;
      return [profileResponse, null];
    } catch (err) {
      console.log(err);
    }
  }
}
