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
    const socialLink = await this.socialLinkRepository.findOneBy(where);

    if (!socialLink) {
      return [null, new NotFoundException('Social link not found')];
    }

    return [socialLink, null];
  }

  async findAll(
    options?: FindManyOptions<SocialLinkEntity>,
  ): TServiceAsyncMethodReturn<SocialLinkEntity[]> {
    const socialLinks = await this.socialLinkRepository.find(options);

    if (!Array.isArray(socialLinks)) {
      return [null, new InternalServerErrorException()];
    }

    return [socialLinks, null];
  }

  async create(
    createSocialLinkDto: CreateSocialLinkDto,
    profileRelationId: number,
  ): TServiceAsyncMethodReturn<SocialLinkEntity> {
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

    if (!createdSocialLink) return [null, new InternalServerErrorException()];

    return [createdSocialLink, null];
  }

  async update(
    id: number,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ): TServiceAsyncMethodReturn<SocialLinkEntity> {
    const [socialLink, err] = await this.findOne({ id });
    if (err) return [null, err];

    const newSocialLink = this.socialLinkRepository.create({
      ...socialLink,
      ...updateSocialLinkDto,
      updatedAt: Date.now(),
    });

    const updatedSocialLink =
      await this.socialLinkRepository.save(newSocialLink);

    if (!updatedSocialLink) return [null, new InternalServerErrorException()];

    return [updatedSocialLink, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<SocialLinkEntity> {
    const [socialLink, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.socialLinkRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [socialLink, null];
  }
}
