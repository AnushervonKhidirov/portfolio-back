import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateContactInfoDto {
  @ApiProperty({ example: 'phone' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '+992 341 44 34 23' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
