import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ example: 'Middle' })
  @IsString()
  @IsNotEmpty()
  name: string;
}