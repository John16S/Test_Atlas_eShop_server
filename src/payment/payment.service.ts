import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/makePayment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
    async makePayment(makePaymentDto: MakePaymentDto){
        try{
            //*достаём поле data из результата запроса на axios
            const { data } = await axios({
                method: 'post',
                url: 'https://api.yookassa.ru/v3/payments',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotence-Key': Date.now(),    //При каждом запросе генерируется уникальный ключ ('типа' id запроса)
                },
                auth: {
                    username: '216295',     //это номер нашего аккаунта на ЮКасса
                    password: 'test_js0e_c-K8u9Uj3uJbFo3WhUVWzMHNOOmDZs0DKtgY8U'    //Api ключ
                },
                data: {     // Данные для запроса
                    "amount": {
                        "value": makePaymentDto.amount, //Сюда вставляем то что приходит с фронта
                        "currency": "RUB"
                    },
                    capture: true,
                    confirmation: {     //Это поле нужно чтоб после оплаты, пользователя редиректнула в магазин
                        type: 'redirect',
                        return_url: 'http://localhost:3001/order'
                    },
                    description: 'Заказ №1',
                },
            });
            
            return data;
        }  
        catch(error){
            throw new ForbiddenException(error);
        }
    }
}
