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

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const company = await this.companiesService.findOne(id);
    if (!company) throw new NotFoundException();
    return company;
  }

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
