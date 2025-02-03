import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsDateString,
  ArrayNotEmpty,
  ValidateIf,
  IsEnum,
} from 'class-validator';

import { Activity, TActivity } from '../companies.type';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  gradeId: string;

  @IsUUID()
  @IsNotEmpty()
  positionId: string;

  @IsEnum(Activity)
  activity: TActivity;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  about: string;

  @IsDateString()
  @IsNotEmpty()
  startAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  endAt: Date;

  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  taskIds: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  achievementIds: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  stackIds: string[];
}
