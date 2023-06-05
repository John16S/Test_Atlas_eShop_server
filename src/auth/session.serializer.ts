import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    //*Нужно реализовать 2 метода - по реализации сессии и детирилизации
    //* serializeUser - метод который возвращает информацию о пользователе, которая будет сохранена в сессии
    serializeUser(user: any, done: (err: Error, user: any) => void) {
        done(null, user);
    }
    //* deserializeUser - метод который возвращает пользователя по информации, которая сохранена в сессии
    deserializeUser(payload: any, done: (err: Error, user: any) => void) {
        done(null, payload);   
    }

} 