import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { FindOneResponse, GetBestsellersResponse, GetByNameRequest, GetByNameResponse, GetNewResponse, PaginateAndFilterResponse, SearchRequest, SearchResponse } from './types/file';
import { ServerResponse } from 'http';

@Controller('goods')
export class GoodsController {
    constructor(private readonly goodService: GoodsService){}

    //*Пишем эндпоинты
    //!paginateAndFilter
    @ApiOkResponse({ type: PaginateAndFilterResponse })
    @UseGuards(AuthenticatedGuard)
    @Get()  //* URL (/goods)    *Надо задать limit и offset*
    paginateAndFilter(@Query() query){
        return this.goodService.paginateAndFilter(query)
    }

    //!findOne
    @ApiOkResponse({ type: FindOneResponse })
    @UseGuards(AuthenticatedGuard)
    @Get('/find/:id')   //* URL (/goods/find/10)
    getOne(@Param('id') id: string){
        return this.goodService.findOne(id)
    }

    //!BestSellers
    @ApiOkResponse({ type: GetBestsellersResponse })
    @UseGuards(AuthenticatedGuard)
    @Get('/bestsellers')   //* URL (/goods/bestsellers)
    getBestsellers(){
        return this.goodService.bestSellersGoods()
    }

    //!New
    @ApiOkResponse({ type: GetNewResponse })
    @UseGuards(AuthenticatedGuard)
    @Get('/new')   //* URL (/goods/new)
    getNews(){
        return this.goodService.newGoods()
    }
    

    //!Поиск по строчке
    @ApiBody({ type: SearchRequest })
    @ApiOkResponse({ type: SearchResponse })
    @UseGuards(AuthenticatedGuard)
    @Post('/search')   //* URL (/goods/search) *Надо задать  "search": "qwe"*
    search(@Body() { search }: { search: string } ){
        return this.goodService.searchByString(search)
    }

    //!Поиск по имени
    @ApiBody({ type: GetByNameRequest })
    @ApiOkResponse({ type: GetByNameResponse })
    @UseGuards(AuthenticatedGuard)
    @Post('/searchByName')   //* URL (/goods/search)    *Надо задать  "name": "qwerty"*
    searchByName(@Body() { name }: { name: string } ){
        return this.goodService.findOneByName(name)
    }
}
