import { ApiProperty } from "@nestjs/swagger";
import { Op } from 'sequelize';
import { faker } from "@faker-js/faker";

class GoodsAtributes {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: faker.lorem.sentence(2) })
    name: string;

    @ApiProperty({ example: faker.lorem.sentence(10) })
    description: string;

    @ApiProperty({ example: faker.random.numeric(4) })
    price: number;

    @ApiProperty({ example: 'XL' })
    size: string;

    @ApiProperty({ example: faker.image.fashion() })
    image: string;

    @ApiProperty({ example: faker.random.numeric(2) })
    quantity: number;

    @ApiProperty({ example: 'Kids' })
    category: string;

    @ApiProperty({ example: 'T-Shirt' })
    subcategory: string;

    @ApiProperty({ example: true })
    bestseller: boolean;

    @ApiProperty({ example: false })
    new: boolean;

    @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
    updatedAt: string;
}

export class PaginateAndFilterResponse {
    @ApiProperty({ example: 10 })
    count: number;

    @ApiProperty({ type: GoodsAtributes, isArray: true })
    rows: GoodsAtributes;
}

export class Bestsellers extends GoodsAtributes {
    @ApiProperty({ example: true })
    bestseller: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterResponse {
    @ApiProperty({ example: 10 })
    count: number;

    @ApiProperty({ type: GoodsAtributes, isArray: true })
    rows: Bestsellers;
}

export class newGoods extends GoodsAtributes {
    @ApiProperty({ example: true })
    new: boolean;
}

export class GetNewResponse extends PaginateAndFilterResponse {
    @ApiProperty({ example: 10 })
    count: number;

    @ApiProperty({ type: GoodsAtributes, isArray: true })
    rows: newGoods;
}

export class SearchByLetterResponse extends GoodsAtributes {
    @ApiProperty({ example: 'Provident incidunt.' })
    name: string;
}

export class SearchResponse extends PaginateAndFilterResponse {
    @ApiProperty({ type: SearchByLetterResponse, isArray: true })
    rows: SearchByLetterResponse;
}

export class SearchRequest {
    @ApiProperty({ example: 'r' })
    search: string;
}

export class GetByNameResponse extends GoodsAtributes {
    @ApiProperty({ example: 'Provident incidunt.' })
    name: string;
}

export class GetByNameRequest {
    @ApiProperty({ example: 'Provident incidunt.' })
    name: string;
}

export class FindOneResponse extends GoodsAtributes {}


//! Интерфейс для querry в файле good.service в методе paginateAndFilter
export interface IGoodQuerry {
    limit: string;  //лимит товаров на одной странице
    offset: string; //отступ
}