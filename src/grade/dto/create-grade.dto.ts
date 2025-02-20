import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ example: 'Junior' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
