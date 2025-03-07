import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ACTIVITY_TAG } from '../activity.type';

export class CreateActivityDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'About google company' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 'experience' })
  @IsEnum(ACTIVITY_TAG)
  tag: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2024-02-18' })
  @IsDateString()
  @ValidateIf((date) => date !== undefined)
  endAt?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  positionId: number;
}
