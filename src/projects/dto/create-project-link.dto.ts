import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectLinkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  href: string;
}
