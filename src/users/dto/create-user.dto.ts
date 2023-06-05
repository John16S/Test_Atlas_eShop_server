import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createUserDto {
    @ApiProperty({example: 'Amin'}) //*Для документации Swagger
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({example: 'qwerty123'}) //*Для документации Swagger
    @IsNotEmpty()
    readonly password: string;
    
    @ApiProperty({example: 'amin@gmail.com'}) //*Для документации Swagger
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({example: 'USER'}) //*Для документации Swagger
    readonly role: string = 'USER'; // Установка значения по умолчанию
}