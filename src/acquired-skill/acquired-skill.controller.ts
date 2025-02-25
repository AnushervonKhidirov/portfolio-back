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
import { AcquiredSkillService } from './acquired-skill.service';
import { CreateAcquiredSkillDto } from './dto/create-acquired-skill.dto';
import { UpdateAcquiredSkillDto } from './dto/update-acquired-skill.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('acquired-skill')
export class AcquiredSkillController {
  constructor(private readonly acquiredSkillService: AcquiredSkillService) {}

  @Get()
  async findAll() {
    const [acquiredSkills, err] = await this.acquiredSkillService.findAll();
    if (err) throw err;
    return acquiredSkills;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    const [acquiredSkill, err] = await this.acquiredSkillService.findOne({
      id,
    });
    if (err) throw err;
    return acquiredSkill;
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createAcquiredSkillDto: CreateAcquiredSkillDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Pick<UserEntity, 'id' | 'defaultProfileId'>;

    const [acquiredSkill, err] = await this.acquiredSkillService.create(
      createAcquiredSkillDto,
      user.defaultProfileId,
    );
    if (err) throw err;
    return acquiredSkill;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateAcquiredSkillDto: UpdateAcquiredSkillDto,
  ) {
    const [acquiredSkill, err] = await this.acquiredSkillService.update(
      id,
      updateAcquiredSkillDto,
    );
    if (err) throw err;
    return acquiredSkill;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    const [acquiredSkill, err] = await this.acquiredSkillService.delete(id);
    if (err) throw err;
    return acquiredSkill;
  }
}
