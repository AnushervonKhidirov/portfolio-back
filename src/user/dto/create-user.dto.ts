import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'expample@mail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
