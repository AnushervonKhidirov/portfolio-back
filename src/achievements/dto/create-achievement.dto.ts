import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({ example: 'Reading old code' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
