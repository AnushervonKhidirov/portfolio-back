import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://github.com' })
  @IsUrl()
  href: string;
}
