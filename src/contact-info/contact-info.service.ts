import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ContactInfoEntity } from './entity/contact-info.entity';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { ProfileService } from 'src/profile/profile.service';

import { TServiceAsyncMethodReturn } from '@common/type/service-method.type';

@Injectable()
export class ContactInfoService {
  constructor(
    @InjectRepository(ContactInfoEntity)
    private readonly contactInfoRepository: Repository<ContactInfoEntity>,

    private readonly profileService: ProfileService,
  ) {}

  async findOne(
    where: FindOptionsWhere<ContactInfoEntity>,
  ): TServiceAsyncMethodReturn<ContactInfoEntity> {
    const contactInfo = await this.contactInfoRepository.findOneBy(where);

    if (!contactInfo) {
      return [null, new NotFoundException('Contact info not found')];
    }

    return [contactInfo, null];
  }

  async findAll(
    options?: FindManyOptions<ContactInfoEntity>,
  ): TServiceAsyncMethodReturn<ContactInfoEntity[]> {
    const contactInfo = await this.contactInfoRepository.find(options);

    if (!Array.isArray(contactInfo)) {
      return [null, new InternalServerErrorException()];
    }

    return [contactInfo, null];
  }

  async create(
    createContactInfoDto: CreateContactInfoDto,
    profileRelationId: number,
  ): TServiceAsyncMethodReturn<ContactInfoEntity> {
    const [profile, profileErr] = await this.profileService.findOne({
      id: profileRelationId,
    });

    if (profileErr) return [null, profileErr];

    const now = Date.now();

    const newContactInfo = this.contactInfoRepository.create({
      ...createContactInfoDto,
      profile,
      createdAt: now,
      updatedAt: now,
    });

    const createdContactInfo =
      await this.contactInfoRepository.save(newContactInfo);

    if (!createdContactInfo) {
      return [null, new InternalServerErrorException()];
    }

    return [createdContactInfo, null];
  }

  async update(
    id: number,
    updateContactInfoDto: UpdateContactInfoDto,
  ): TServiceAsyncMethodReturn<ContactInfoEntity> {
    const [contactInfo, err] = await this.findOne({ id });
    if (err) return [null, err];

    const newContactInfo = this.contactInfoRepository.create({
      ...contactInfo,
      ...updateContactInfoDto,
      updatedAt: Date.now(),
    });

    const updatedContactInfo =
      await this.contactInfoRepository.save(newContactInfo);

    if (!updatedContactInfo) {
      return [null, new InternalServerErrorException()];
    }

    return [updatedContactInfo, null];
  }

  async delete(id: number): TServiceAsyncMethodReturn<ContactInfoEntity> {
    const [contactInfo, err] = await this.findOne({ id });
    if (err) return [null, err];

    const result = await this.contactInfoRepository.delete(id);
    if (!result.affected) return [null, new InternalServerErrorException()];

    return [contactInfo, null];
  }
}
