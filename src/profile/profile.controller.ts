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
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async findAll() {
    const [profiles, err] = await this.profileService.findAll();
    if (err) throw err;
    return profiles;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [profile, err] = await this.profileService.findOne({ id });
    if (err) throw err;
    return profile;
  }

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

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    const [profile, err] = await this.profileService.update(
      id,
      updateProfileDto,
    );
    if (err) throw err;
    return profile;
  }

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
