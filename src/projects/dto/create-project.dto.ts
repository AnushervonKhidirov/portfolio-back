import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUUID,
  ArrayNotEmpty,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLinkDto } from 'src/links/dto/create-link.dto';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  image: string;

  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  stackIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links: CreateLinkDto[];
}
