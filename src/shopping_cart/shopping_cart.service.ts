import { Injectable } from '@nestjs/common';
import { ShoppingCart } from './shopping_cart.model';
import { UsersService } from 'src/users/users.service';
import { GoodsService } from 'src/goods/goods.service';
import { InjectModel } from '@nestjs/sequelize';
import { AddToCartDto } from './dto/addToCart.dto';

@Injectable()
export class ShoppingCartService {
    constructor(
        @InjectModel(ShoppingCart)
        private shoppingCartModel: typeof ShoppingCart,
        private readonly userService: UsersService,    //хранить в себе нашу модель Goods c которым мы можем манипулировать
        private readonly goodService: GoodsService
    ){}

    //!Методы для корзины
    //*Метод для нахожедние всех элементов корзины для конкретного пользователя
    async findAll(userId: number | string): Promise<ShoppingCart[]>{
        return this.shoppingCartModel.findAll({ where: { userId } })
    }

    //*Метод для добавление элемента в корзину
    async add(addToCartDto: AddToCartDto){
        const cart = new ShoppingCart(); //новый объект ShoppingCart (это модель)
        const user = await this.userService.findOne(
            { where: { username: addToCartDto.username } }  //Получаем user-a ктр добавил товар в корзину
        )
        const good = await this.goodService.findOne(addToCartDto.goodId)    //получаем сам товар который будет добавлен в корзину
        
        cart.userId = user.id;
        cart.goodId = good.id;
        cart.name = good.name;
        cart.price = good.price;
        cart.size = good.size;
        cart.image = good.image;
        cart.image = JSON.parse(good.image)[0]; //Массив картинок в БД парсим и берём первый
        cart.category = good.category;
        cart.subcategory = good.subcategory;
        //*cart.count = 0 - по умолчанию он равен 0, для него напишем отдельный метод ниже
        cart.totalPrice = good.price;   //изначально так, потом при увелечение элемента, будет прибавлятся это цена 
    
        return cart.save(); //Сохраняем его в таблице
    }

    //*Метод для обновление count
    async updateCount(count: number, goodId: number | string): Promise<{ count: number }>{
        //*Promise<{ count: number }> -возвращаем Promise объекта count, то есть обновлённый count
        await this.shoppingCartModel.update({ count }, { where: { goodId } })  //update принимает 2 парам - 1. поле ктр нужно обновить, 2. фильтр('типа' условия)
        return {count};
    }

    //*Метод для обновление totalPrice
    async updateTotalPrice(totalPrice: number, goodId: number | string): Promise<{ totalPrice: number }>{
        //*Promise<{ totalPrice: number }> -возвращаем Promise объекта totalPrice, то есть обновлённый totalPrice
        await this.shoppingCartModel.update({ totalPrice }, { where: { goodId } })  //update принимает 2 парам - 1. поле ктр нужно обновить, 2. фильтр('типа' условия)
        return {totalPrice};
    }

    //*Метод для удаление одного элемента из корзины
    async remove(goodId: number | string): Promise<void>{
        const good = this.shoppingCartModel.findOne({ where: { goodId } }); //находим по id товар
        (await good).destroy();     //и уничтожаем его (из корзины конечено :D)
    }

    //*Метод для удаление всех элементов из корзины
    async removeAll(userId: number | string): Promise<void>{
        await this.shoppingCartModel.destroy({ where: {userId} })     //уничтожаем все товары из корзины по id user-а 
    }
}
