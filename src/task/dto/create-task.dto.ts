import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Bug fixing' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
