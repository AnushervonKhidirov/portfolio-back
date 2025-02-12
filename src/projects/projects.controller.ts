import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  ValidationPipe,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  ParseFilePipe,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project) throw new NotFoundException();
    return project;
  }

  @Get('image/:name')
  async findImage(@Param('name') name: string, @Res() res: Response) {
    const image = await this.projectsService.findImage(name);
    if (!image) throw new NotFoundException();
    return res.status(200).sendFile(image);
  }

  @Post()
  async create(@Body(new ValidationPipe()) createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(createProjectDto);
    if (!project) throw new BadRequestException();
    return project;
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    image: Express.Multer.File,
  ) {
    const imagePath = await this.projectsService.uploadImage(image);
    if (!imagePath) throw new BadRequestException('Unable to save image');
    return imagePath;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);
    if (!project) throw new NotFoundException();
    return project;
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.projectsService.delete(id);
    if (!result) throw new NotFoundException();
  }
}
