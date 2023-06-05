import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AddToCartDto } from './dto/addToCart.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AddToCardResponse, GetAllResponse, TotalPriceRequest, TotalPriceResponse, UpdateCountRequest, UpdateCountResponse } from './types/file';

@Controller('shopping-cart')
export class ShoppingCartController {
    constructor(private readonly shoppingCartService: ShoppingCartService){}
    
    //!Эндпоинты для корзины
    //*получение всех элементов по userId
    @ApiOkResponse({type: [GetAllResponse]})    //Для документации Swagger
    @UseGuards(AuthenticatedGuard)
    @Get('/:id')    //* URL (shopping-cart/id)
    getAll(@Param('id') userId: string){
        return this.shoppingCartService.findAll(userId);
    }

    //*добавление элементов в корзину
    @ApiOkResponse({type: AddToCardResponse})   //Для документации Swagger
    @UseGuards(AuthenticatedGuard)
    @Post('/add')    //* URL (shopping-cart/add)    *Нужно вводить username и goodId*
    addToCart(@Body() addToCartDto: AddToCartDto ){
        return this.shoppingCartService.add(addToCartDto);
    }

    //*обновление поле count
    //*PATCH — для частичного обновления существующих ресурсов
    @ApiOkResponse({type: UpdateCountResponse})   //Для документации Swagger
    @ApiBody({type: UpdateCountRequest})
    @UseGuards(AuthenticatedGuard)
    @Patch('/count/:id')    //* URL (shopping-cart/count/id-это id товара)    *Нужно вводить count и goodId(в запросе)*
    updateCount(
        @Body() { count }: {count: number}, 
        @Param('id') goodId: string 
    ){
        return this.shoppingCartService.updateCount(count, goodId);
    }

    //*обновление поле totalprice
    @ApiOkResponse({type: TotalPriceResponse})   //Для документации Swagger
    @ApiBody({type: TotalPriceRequest})
    @UseGuards(AuthenticatedGuard)
    @Patch('/totalPrice/:id')    //* URL (shopping-cart/totalPrice/id-это id товара)    *Нужно вводить totalPrice и goodId(в запросе)*
    updateTotalPrice(
        @Body() { totalPrice }: {totalPrice: number}, 
        @Param('id') goodId: string 
    ){
        return this.shoppingCartService.updateTotalPrice(totalPrice, goodId);
    }

    //*Удаление элемента из корзины
    @UseGuards(AuthenticatedGuard)
    @Delete('/removeOne/:id')    //* URL (shopping-cart/totalPrice/id-это id товара)    *Нужно вводить goodId(в запросе)*
    removeOne(@Param('id') goodId: string ){
        return this.shoppingCartService.remove(goodId);
    }

    //*Удаление всех элементов из корзины
    @UseGuards(AuthenticatedGuard)
    @Delete('/removeAll/:id')    //* URL (shopping-cart/removeAll/id-это user-a)    *Нужно вводить userId(в запросе)*
    removeAll(@Param('id') userId: string ){
        return this.shoppingCartService.removeAll(userId);
    }
}
