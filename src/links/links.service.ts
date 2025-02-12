import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkEntity } from './entity/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepository: Repository<LinkEntity>,
  ) {}

  async findOne(id: string) {
    try {
      return await this.linkRepository.findOneBy({ id });
    } catch (err) {
      console.log(err);
    }
  }

  async findAll() {
    try {
      return await this.linkRepository.find();
    } catch (err) {
      console.log(err);
    }
  }

  async createOne(createLinkDto: CreateLinkDto) {
    try {
      const link = this.linkRepository.create(createLinkDto);
      return await this.linkRepository.save(link);
    } catch (err) {
      console.log(err);
    }
  }

  async createMany(createLinkDto: CreateLinkDto[]) {
    try {
      const links = this.linkRepository.create(createLinkDto);
      return await this.linkRepository.save(links);
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    try {
      const isExist = await this.linkRepository.existsBy({ id });
      if (!isExist) throw new Error('Link not found');

      return await this.linkRepository.update(id, updateLinkDto);
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id: string) {
    try {
      const isExist = await this.linkRepository.existsBy({ id });
      if (!isExist) throw new Error('Link not found');

      return await this.linkRepository.delete(id);
    } catch (err) {
      console.log(err);
    }
  }
}
