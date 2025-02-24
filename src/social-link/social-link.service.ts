import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { SocialLinkEntity } from './entity/social-link.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { ProfileService } from 'src/profile/profile.service';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class SocialLinkService {
  constructor(
    @InjectRepository(SocialLinkEntity)
    private readonly socialLinkRepository: Repository<SocialLinkEntity>,

    private readonly profileService: ProfileService,
  ) {}

  async findOne(
    where: FindOptionsWhere<SocialLinkEntity>,
  ): TServiceAsyncMethodReturn<SocialLinkEntity> {
    try {
      const socialLink = await this.socialLinkRepository.findOneBy(where);
      if (!socialLink) {
        return [null, new NotFoundException('Social link not found')];
      }

      return [socialLink, null];
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(
    options?: FindManyOptions<SocialLinkEntity>,
  ): TServiceAsyncMethodReturn<SocialLinkEntity[]> {
    try {
      const socialLinks = await this.socialLinkRepository.find(options);
      if (!Array.isArray(socialLinks)) {
        return [null, new InternalServerErrorException()];
      }

      return [socialLinks, null];
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    createSocialLinkDto: CreateSocialLinkDto,
    profileRelationId: number,
  ): TServiceAsyncMethodReturn<SocialLinkEntity> {
    try {
      const [profile, profileErr] = await this.profileService.findOne({
        id: profileRelationId,
      });
      if (profileErr) return [null, profileErr];

      const now = Date.now();

      const newSocialLink = this.socialLinkRepository.create({
        ...createSocialLinkDto,
        profile,
        createdAt: now,
        updatedAt: now,
      });

      const createdSocialLink =
        await this.socialLinkRepository.save(newSocialLink);

      if (!createdSocialLink) {
        return [null, new InternalServerErrorException()];
      }

      return [createdSocialLink, null];
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    id: number,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ): TServiceAsyncMethodReturn<SocialLinkEntity> {
    try {
      const socialLink = await this.socialLinkRepository.findOneBy({ id });

      if (!socialLink) {
        return [null, new NotFoundException('Social link info not found')];
      }

      const newSocialLink = this.socialLinkRepository.create({
        ...socialLink,
        ...updateSocialLinkDto,
        updatedAt: Date.now(),
      });

      const updatedSocialLink =
        await this.socialLinkRepository.save(newSocialLink);

      if (!updatedSocialLink) {
        return [null, new InternalServerErrorException()];
      }

      return [updatedSocialLink, null];
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: number): TServiceAsyncMethodReturn<SocialLinkEntity> {
    try {
      const socialLink = await this.socialLinkRepository.findOneBy({ id });

      if (!socialLink) {
        return [null, new NotFoundException('Social link info not found')];
      }

      const result = await this.socialLinkRepository.delete(id);

      if (!result) {
        return [null, new InternalServerErrorException()];
      }

      return [socialLink, null];
    } catch (err) {
      console.log(err);
    }
  }
}
