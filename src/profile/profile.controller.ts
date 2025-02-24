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
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entity/profile.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOkResponse({ type: ProfileEntity, isArray: true })
  @Get()
  async findAll() {
    const [profiles, err] = await this.profileService.findAll();
    if (err) throw err;
    return profiles;
  }

  @ApiOkResponse({ type: ProfileEntity })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [profile, err] = await this.profileService.findOne({ id });
    if (err) throw err;
    return profile;
  }

  @ApiOkResponse({ type: ProfileEntity })
  @Post()
  async create(
    @Body(new ValidationPipe()) createProfileDto: CreateProfileDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id'>;

    const [profile, err] = await this.profileService.create(
      createProfileDto,
      user.id,
    );

    if (err) throw err;
    return profile;
  }

  @ApiOkResponse({ type: ProfileEntity })
  @Patch('switch/:id')
  async switch(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id'>;

    const [profile, err] = await this.profileService.switch(id, user.id);
    if (err) throw err;

    return profile;
  }

  @ApiOkResponse({ type: ProfileEntity })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto,
  ) {
    const [profile, err] = await this.profileService.update(
      id,
      updateProfileDto,
    );
    if (err) throw err;
    return profile;
  }

  @ApiOkResponse({ type: ProfileEntity })
  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    const [profile, err] = await this.profileService.delete(id);
    if (err) throw err;
    return profile;
  }
}
