import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MakePaymentDto {
    @ApiProperty({ example: '2000' })
    @IsNotEmpty()
    readonly amount: number;
}