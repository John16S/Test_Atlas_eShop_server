import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddToCartDto {
    @ApiProperty({ example: 'Amin' })
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({ example: 1 })
    @IsOptional()
    userId?: number;    //Для типизации для typescript

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    readonly goodId: number;
}