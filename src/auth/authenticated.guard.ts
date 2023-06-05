import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

//Этот Гуард будет вызыватся перед эндпоинтом и проверят есть ли в request'е //!session id
//*Простыми словами этот класс проверяет залогинин ли пользователь
@Injectable()
export class AuthenticatedGuard implements CanActivate {
    //*метод canActivate возвращает bool значение, есть ли в запросе session_id
    async canActivate(context: ExecutionContext) {
        //получаем запрос
        const request = context.switchToHttp().getRequest();
        
        //и проверяем возврашая bool значение
        return request.isAuthenticated(); //*Так как мы зарегистрировали session через passport (в main.ts), у request будет доступен метод isAuthenticated
    }
}
