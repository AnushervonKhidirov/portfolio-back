import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'some@email.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'some strong password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
