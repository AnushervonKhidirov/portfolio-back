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
import { ApiProperty } from '@nestjs/swagger';

import { Activity, TActivity } from '../companies.type';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'be2131c3-4807-4838-83f7-9e28fe32252c' })
  @IsUUID('4')
  @IsNotEmpty()
  gradeId: string;

  @ApiProperty({ example: '58cc01d6-4c52-45b5-87f2-d00dcc13f535' })
  @IsUUID('4')
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({ example: 'experience' })
  @IsEnum(Activity)
  activity: TActivity;

  @ApiProperty({ example: 'About company' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  about: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsDateString()
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== undefined)
  endAt: Date;

  @ApiProperty({
    example: [
      '0a4b0215-54e3-4af9-a6bd-a214b9a2ac10',
      '773a9a17-fe47-4d82-a298-e3e41c5ba595',
    ],
  })
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  taskIds: string[];

  @ApiProperty({
    example: [
      '017252e8-667b-461e-8f8e-6fe005fe8d46',
      'ccf11e7a-8980-4a69-8663-b6ccefd39ee5',
    ],
  })
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  achievementIds: string[];

  @ApiProperty({
    example: [
      '5db2f0c1-7592-4b6d-948f-b1dd54e66e0b',
      '9b2f4d17-49d0-477f-9eb1-efa395a614ba',
    ],
  })
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  stackIds: string[];
}
