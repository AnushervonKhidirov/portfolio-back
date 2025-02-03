import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CompanyEntity } from './entity/company.entity';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const example = {
  id: 'bb814f6d-3085-4b8e-90af-23c01104804d',
  name: 'Google',
  activity: 'experience',
  about: 'About company',
  startAt: '2020-02-01',
  endAt: '2023-02-01',
  grade: {
    id: 'be2131c3-4807-4838-83f7-9e28fe32252c',
    name: 'Middle',
    createdAt: '2025-01-31T15:00:53.972Z',
  },
  position: {
    id: '96c28674-2634-4973-9e15-3d2cc5d7194c',
    name: 'Back-End',
    createdAt: '2025-01-31T14:23:07.668Z',
  },
  tasks: [
    {
      id: '0a4b0215-54e3-4af9-a6bd-a214b9a2ac10',
      value: 'Task 5',
      createdAt: '2025-02-03T13:49:40.991Z',
    },
    {
      id: '773a9a17-fe47-4d82-a298-e3e41c5ba595',
      value: 'Task 4',
      createdAt: '2025-02-03T13:49:37.677Z',
    },
  ],
  achievements: [
    {
      id: '017252e8-667b-461e-8f8e-6fe005fe8d46',
      value: 'Reading old code',
      createdAt: '2025-02-03T05:13:02.061Z',
    },
  ],
  stack: [
    {
      id: '5db2f0c1-7592-4b6d-948f-b1dd54e66e0b',
      name: 'HTML',
      createdAt: '2025-02-03T05:35:29.724Z',
    },
    {
      id: '9b2f4d17-49d0-477f-9eb1-efa395a614ba',
      name: 'CSS',
      createdAt: '2025-02-03T05:35:32.930Z',
    },
  ],
  createdAt: '2025-02-03T16:05:56.480Z',
};

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOkResponse({
    isArray: true,
    type: CompanyEntity,
    example: [example],
  })
  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @ApiOkResponse({
    isArray: true,
    type: CompanyEntity,
    example: example,
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const company = await this.companiesService.findOne(id);
    if (!company) throw new NotFoundException();
    return company;
  }

  @ApiOkResponse({
    isArray: true,
    type: CompanyEntity,
    example: example,
  })
  @Post()
  async create(@Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto) {
    const company = await this.companiesService.create(createCompanyDto);
    if (!company) {
      throw new BadRequestException(
        'Something went wrong, please make sure that all properties are correct',
      );
    }

    return company;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) updateCompanyDto: UpdateCompanyDto,
  ) {
    const result = await this.companiesService.update(id, updateCompanyDto);
    if (!result) throw new NotFoundException();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.companiesService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
