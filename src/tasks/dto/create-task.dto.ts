import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Refactoring code' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
