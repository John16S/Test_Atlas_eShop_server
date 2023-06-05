import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    //Один метод который будет делать валидацию пользователя 
    constructor(private readonly userService: UsersService){}   //Для метода findOne

    //*Сам метод валидации
    async validateUser(username: string, password: string) {
        //сначало найдём пользователья в БД
        const user = await this.userService.findOne({where: {username}})

        //!Если же нету пользователя...
        if(!user){
            throw new UnauthorizedException('Invalid credentails!');
        }

        //*Если есть то проверяем его пароль на правильность
        const isPasswordValid = await bcrypt.compare(password, user.password);

        //!Если же пароль не правильный...
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentails!');
        }

        //*Если и пользователь и пароль правильный, то...
        if(user && isPasswordValid){
            return{
                userId: user.id,
                userName: user.username,
                email: user.email,
                role: user.role
            }
        }

        //*иначе
        return null;
    }
}
