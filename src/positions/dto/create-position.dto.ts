import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePositionDto {
    @ApiProperty({ example: 'Back-End' })
    @IsString()
    @IsNotEmpty()
    name: string
}