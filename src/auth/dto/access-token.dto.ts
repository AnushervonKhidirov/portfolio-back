import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NDgyMjQ0My1lMTFjLTRlNTgtOWVlYS0zYmM4ZTdlODBkZjEiLCJ1c2VyRW1haWwiOiJteWVtYWlsQGdtYWlsLmNvbSIsImlhdCI6MTczODk0MjM0NywiZXhwIjoxNzM4OTQyNDA3fQ.iDRnOrGMi4LOUp4M--2K1bPRTU28J0VfiCaNd0wm7WE',
  })
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
