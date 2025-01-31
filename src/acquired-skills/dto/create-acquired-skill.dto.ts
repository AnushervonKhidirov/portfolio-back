import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateAcquiredSkillDto {
  @ApiProperty({ example: '3e0603be-5916-4073-a571-02522d7609ab' })
  @IsUUID('4')
  skillId: string;

  @ApiProperty({ example: 80 })
  @IsNumber()
  progress: number;
}
