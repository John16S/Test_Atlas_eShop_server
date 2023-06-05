import { ApiProperty } from '@nestjs/swagger';

//*Данные с фронта
export class LoginUserRequest {
    @ApiProperty({ example: 'Amin' })
    username: string;

    @ApiProperty({ example: 'qwerty123' })
    password: string;
}

//*Ответ из бэка
export class LoginUserResponse {
    @ApiProperty({
        example: {
        user: {
            userId: 1,
            username: 'Ivan',
            password: 'ivan123',
            role: 'USER',
        },
        },
    })
    user: {
        userId: number;
        username: string;
        password: string;
        role: string;
    };

    @ApiProperty({ example: 'Logged in' })
    msg: string;
}

//*Ответ бэка
export class LogoutUserResponse {
    @ApiProperty({ example: 'Logged out, session has ended' })
    msg: string;
}

//*Ответ бэка
export class LoginCheckResponse {
    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: 'Amin' })
    username: string;

    @ApiProperty({ example: 'amin@gmail.com' })
    email: string;
}

//*Ответ бэка
export class SignupResponse {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Amin' })
    username: string;

    @ApiProperty({ example: '$2b$10$8BjDHF4eZKxtmozBMMf75u9WSKR42MOeFbS9VC7e3RKoN8GTII41q' })
    password: string;

    @ApiProperty({ example: 'amin@gmail.com' })
    email: string;

    @ApiProperty({ example: 'USER' })
    role: string

    @ApiProperty({ example: '2023-06-01 19:29:28.201+03' })
    updatedAt: string;

    @ApiProperty({ example: '2023-06-01 19:29:28.201+03' })
    createdAt: string;
}
