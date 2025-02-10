import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUUID,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectLinkDto } from './create-project-link.dto';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  stackIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectLinkDto)
  links: CreateProjectLinkDto[];
}
