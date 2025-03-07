import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({ example: 'Writing clean code' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
