import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'FirstName' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'LastName' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '2001-04-23' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'expample@mail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'your_password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
