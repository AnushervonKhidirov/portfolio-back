import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class CreateAcquiredSkillDto {
  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  skillId: number;
}
