import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-tast.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
