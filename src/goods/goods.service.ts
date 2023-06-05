import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize'
import { Goods } from './goods.model';
import { IGoodQuerry } from './types/file';

@Injectable()
export class GoodsService {
    //*Получим доступ к модели Goods
    constructor(
        @InjectModel(Goods)
        private goodsModel: typeof Goods    //хранить в себе нашу модель Goods c которым мы можем манипулировать
    ){}

    //!методы для получение товаров
    //!метод findAndCountAll - возвращает count и rows, по этому в Promise надо указать так
    //*метод который возвращает постраничную пагинацию, и по определённому фильтру
    async paginateAndFilter(
        querry: IGoodQuerry //*Надо создать интерфейс для "querry"
        ): Promise<{ count: number; rows: Goods[] }>{
            const limit = +querry.limit;    //лимит товаров на странице
            const offset = +querry.offset * limit; //отступ товаров (если limit-15, offset-1, то выводится товары с 16 по 30)

            return this.goodsModel.findAndCountAll({ limit, offset })
        }

    //*Метод для получение Бестселлеров 
    async bestSellersGoods(): Promise<{ count: number; rows: Goods[] }>{
        return this.goodsModel.findAndCountAll({ 
            where: {bestseller: true}
        })
    }
    //*Метод для получение Новинок
    async newGoods(): Promise<{ count: number; rows: Goods[] }>{
        return this.goodsModel.findAndCountAll({ 
            where: {new: true}
        })
    }

    //*Метод для получение одного товара
    async findOne(id: number | string): Promise<Goods>{  //В Promise возвращаем объект Goods
        return this.goodsModel.findOne({ 
            where: { id }
        })
    }

    //*Метод для получение товара по имени *Для поиска по сайту* 
    async findOneByName(name: string): Promise<Goods>{  //В Promise возвращаем объект Goods
        return this.goodsModel.findOne({ 
            where: { name }
        })
    }

    //*Метод для получение списка товаров *Для не полного поиска, выпадающий список для поле поиска* 
    async searchByString(str: string): Promise<{ count: number; rows: Goods[] }>{  //В Promise возвращаем объект Goods
        return this.goodsModel.findAndCountAll({
            limit: 10,  //только 10 элементов в списке
            where: { name: { [Op.like]: `%${str}%` } }
        })
    }
}