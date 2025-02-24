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
import { SocialLinkService } from './social-link.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { SocialLinkEntity } from './entity/social-link.entity';

@Controller('social-link')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @ApiOkResponse({ type: SocialLinkEntity, isArray: true })
  @Get()
  async findAll() {
    const [socialLinks, err] = await this.socialLinkService.findAll();
    if (err) throw err;
    return socialLinks;
  }

  @ApiOkResponse({ type: SocialLinkEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [socialLink, err] = await this.socialLinkService.findOne({ id });
    if (err) throw err;
    return socialLink;
  }

  @ApiOkResponse({ type: SocialLinkEntity })
  @Post()
  async create(
    @Body(new ValidationPipe()) createSocialLinkDto: CreateSocialLinkDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id' | 'defaultProfileId'>;

    const [socialLink, err] = await this.socialLinkService.create(
      createSocialLinkDto,
      user.defaultProfileId,
    );
    if (err) throw err;
    return socialLink;
  }

  @ApiOkResponse({ type: SocialLinkEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    const [socialLink, err] = await this.socialLinkService.update(
      id,
      updateSocialLinkDto,
    );
    if (err) throw err;
    return socialLink;
  }

  @ApiOkResponse({ type: SocialLinkEntity })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [socialLink, err] = await this.socialLinkService.delete(id);
    if (err) throw err;
    return socialLink;
  }
}
