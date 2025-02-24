import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ContactInfoService } from './contact-info.service';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { ContactInfoEntity } from './entity/contact-info.entity';

@Controller('contact-info')
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  @ApiOkResponse({ type: ContactInfoEntity, isArray: true })
  @Get()
  async findAll() {
    const [contactInfo, err] = await this.contactInfoService.findAll();
    if (err) throw err;
    return contactInfo;
  }

  @ApiOkResponse({ type: ContactInfoEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [contactInfo, err] = await this.contactInfoService.findOne({ id });
    if (err) throw err;
    return contactInfo;
  }

  @ApiOkResponse({ type: ContactInfoEntity })
  @Post()
  async create(
    @Body(new ValidationPipe()) createContactInfoDto: CreateContactInfoDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id' | 'defaultProfileId'>;

    const [contactInfo, err] = await this.contactInfoService.create(
      createContactInfoDto,
      user.defaultProfileId,
    );
    if (err) throw err;
    return contactInfo;
  }

  @ApiOkResponse({ type: ContactInfoEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateContactInfoDto: UpdateContactInfoDto,
  ) {
    const [contactInfo, err] = await this.contactInfoService.update(
      id,
      updateContactInfoDto,
    );
    if (err) throw err;
    return contactInfo;
  }

  @ApiOkResponse({ type: ContactInfoEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [contactInfo, err] = await this.contactInfoService.delete(id);
    if (err) throw err;
    return contactInfo;
  }
}
