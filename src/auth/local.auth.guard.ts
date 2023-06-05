import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest(); //!localAuthGuard получит request

        await super.logIn(request); //! и передаёт в метод login класса AuthGuard

        return result;
    }
}