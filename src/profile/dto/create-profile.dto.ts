import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'FirstName' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'LastName' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'About you' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  positionId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  gradeId: number;
}
